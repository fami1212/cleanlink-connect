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
}

export interface Favorite {
  id: string;
  user_id: string;
  provider_id: string;
  created_at: string;
  provider?: Provider;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data: favData, error: favError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id);

    if (favError) {
      console.error("Error fetching favorites:", favError);
      setLoading(false);
      return;
    }

    // Get provider details
    const providerIds = (favData || []).map((f: any) => f.provider_id);
    
    if (providerIds.length > 0) {
      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .in("id", providerIds);

      const favoritesWithProviders = (favData || []).map((fav: any) => ({
        ...fav,
        provider: (providerData || []).find((p: any) => p.id === fav.provider_id),
      }));

      setFavorites(favoritesWithProviders as Favorite[]);
    } else {
      setFavorites([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const addFavorite = async (providerId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        provider_id: providerId,
      })
      .select()
      .single();

    if (!error) {
      fetchFavorites();
    }

    return { data, error };
  };

  const removeFavorite = async (providerId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("provider_id", providerId);

    if (!error) {
      setFavorites((prev) => prev.filter((f) => f.provider_id !== providerId));
    }

    return { error };
  };

  const isFavorite = (providerId: string) => {
    return favorites.some((f) => f.provider_id === providerId);
  };

  return { favorites, loading, addFavorite, removeFavorite, isFavorite };
};
