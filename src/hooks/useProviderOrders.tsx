import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMyProvider } from "./useProviders";
import { Order, OrderStatus } from "@/types/database";

export interface OrderWithDistance extends Order {
  distance?: number;
  estimatedTime?: number;
}

// Haversine formula to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate travel time in minutes (assuming 30 km/h average in Dakar traffic)
const estimateTime = (distanceKm: number): number => {
  return Math.round((distanceKm / 30) * 60);
};

export const useProviderOrders = () => {
  const { provider } = useMyProvider();
  const [pendingOrders, setPendingOrders] = useState<OrderWithDistance[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderWithDistance | null>(null);
  const [completedOrders, setCompletedOrders] = useState<OrderWithDistance[]>([]);
  const [loading, setLoading] = useState(true);

  const enrichOrderWithDistance = useCallback(
    (order: Order): OrderWithDistance => {
      if (provider?.latitude && provider?.longitude && order.latitude && order.longitude) {
        const distance = calculateDistance(
          provider.latitude,
          provider.longitude,
          order.latitude,
          order.longitude
        );
        return {
          ...order,
          distance: Math.round(distance * 10) / 10,
          estimatedTime: estimateTime(distance),
        };
      }
      return order;
    },
    [provider?.latitude, provider?.longitude]
  );

  const fetchOrders = useCallback(async () => {
    if (!provider) return;

    setLoading(true);

    // Fetch pending orders (available missions)
    const { data: pending, error: pendingError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .is("provider_id", null)
      .order("created_at", { ascending: false });

    if (pendingError) {
      console.error("Error fetching pending orders:", pendingError);
    } else {
      const enrichedPending = (pending || []).map((order) =>
        enrichOrderWithDistance(order as Order)
      );
      setPendingOrders(enrichedPending);
    }

    // Fetch active order (current mission)
    const { data: active, error: activeError } = await supabase
      .from("orders")
      .select("*")
      .eq("provider_id", provider.id)
      .in("status", ["accepted", "in_progress"])
      .maybeSingle();

    if (activeError) {
      console.error("Error fetching active order:", activeError);
    } else if (active) {
      setActiveOrder(enrichOrderWithDistance(active as Order));
    } else {
      setActiveOrder(null);
    }

    // Fetch completed orders
    const { data: completed, error: completedError } = await supabase
      .from("orders")
      .select("*")
      .eq("provider_id", provider.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(50);

    if (completedError) {
      console.error("Error fetching completed orders:", completedError);
    } else {
      setCompletedOrders((completed || []) as OrderWithDistance[]);
    }

    setLoading(false);
  }, [provider, enrichOrderWithDistance]);

  useEffect(() => {
    if (provider) {
      fetchOrders();

      // Subscribe to real-time order changes
      const channel = supabase
        .channel("provider-orders")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          (payload) => {
            console.log("Order change detected:", payload);
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [provider, fetchOrders]);

  const acceptOrder = async (orderId: string) => {
    if (!provider) return { error: new Error("Not a provider") };

    const { data, error } = await supabase
      .from("orders")
      .update({
        provider_id: provider.id,
        status: "accepted" as OrderStatus,
        accepted_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("status", "pending")
      .is("provider_id", null)
      .select()
      .single();

    if (!error && data) {
      setActiveOrder(enrichOrderWithDistance(data as Order));
      setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
    }

    return { data, error };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!provider) return { error: new Error("Not a provider") };

    const updates: Record<string, unknown> = { status };
    
    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .eq("provider_id", provider.id)
      .select()
      .single();

    if (!error && data) {
      if (status === "completed") {
        setActiveOrder(null);
        setCompletedOrders((prev) => [data as OrderWithDistance, ...prev]);
      } else {
        setActiveOrder(enrichOrderWithDistance(data as Order));
      }
    }

    return { data, error };
  };

  const refuseOrder = async (orderId: string) => {
    // Simply remove from local state - the order stays in DB for other providers
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
    return { error: null };
  };

  return {
    pendingOrders,
    activeOrder,
    completedOrders,
    loading,
    acceptOrder,
    updateOrderStatus,
    refuseOrder,
    refetch: fetchOrders,
  };
};
