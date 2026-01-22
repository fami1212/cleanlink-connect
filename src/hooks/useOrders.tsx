import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Order, ServiceType, PaymentMethod } from "@/types/database";

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      // Use raw query since types aren't regenerated yet
      const { data, error } = await (supabase as any)
        .from("orders")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        const typedData = (data || []) as Order[];
        setOrders(typedData);
        // Set the most recent active order as current
        const activeOrder = typedData.find(
          (o) => o.status !== "completed" && o.status !== "cancelled"
        );
        setCurrentOrder(activeOrder || null);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `client_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev]);
            setCurrentOrder(payload.new as Order);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o))
            );
            if (currentOrder?.id === (payload.new as Order).id) {
              setCurrentOrder(payload.new as Order);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createOrder = async (orderData: {
    service_type: ServiceType;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    price_min?: number | null;
    price_max?: number | null;
    payment_method?: PaymentMethod | null;
    notes?: string | null;
  }) => {
    if (!user) return { error: new Error("User not authenticated"), data: null };

    const { data, error } = await (supabase as any)
      .from("orders")
      .insert({
        ...orderData,
        client_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setCurrentOrder(data as Order);
    }

    return { data: data as Order | null, error };
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const { data, error } = await (supabase as any)
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();

    return { data: data as Order | null, error };
  };

  return { orders, loading, currentOrder, createOrder, updateOrder };
};
