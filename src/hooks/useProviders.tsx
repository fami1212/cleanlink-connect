import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Provider {
  id: string;
  user_id: string;
  company_name: string | null;
  is_online: boolean | null;
  is_verified: boolean | null;
  vehicle_type: string | null;
  capacity_liters: number | null;
  rating: number | null;
  total_missions: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("is_online", true);

      if (error) {
        console.error("Error fetching providers:", error);
      } else {
        setProviders((data || []) as Provider[]);
      }
      setLoading(false);
    };

    fetchProviders();

    // Subscribe to provider status changes
    const channel = supabase
      .channel("providers-online")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "providers",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Provider;
            if (updated.is_online) {
              setProviders((prev) => {
                const exists = prev.find((p) => p.id === updated.id);
                if (exists) {
                  return prev.map((p) => (p.id === updated.id ? updated : p));
                }
                return [...prev, updated];
              });
            } else {
              setProviders((prev) => prev.filter((p) => p.id !== updated.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { providers, loading };
};

export const useMyProvider = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProvider(null);
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setProvider(data as Provider);
      }
      setLoading(false);
    };

    fetchProvider();
  }, [user]);

  const updateProvider = async (updates: Partial<Provider>) => {
    if (!user || !provider) return { error: new Error("Not a provider") };

    const { data, error } = await supabase
      .from("providers")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error && data) {
      setProvider(data as Provider);
    }

    return { data: data as Provider | null, error };
  };

  const createProvider = async (providerData: Partial<Provider>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("providers")
      .insert({
        ...providerData,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setProvider(data as Provider);
    }

    return { data: data as Provider | null, error };
  };

  return { provider, loading, updateProvider, createProvider };
};
