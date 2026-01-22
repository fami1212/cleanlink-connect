import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { UserRole } from "@/types/database";

export type { UserRole } from "@/types/database";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      // Use raw query since types aren't regenerated yet
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching role:", error);
      }
      
      setRole(data?.role || null);
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const setUserRole = async (newRole: UserRole) => {
    if (!user) return { error: new Error("User not authenticated") };

    const { error } = await (supabase as any)
      .from("user_roles")
      .upsert({
        user_id: user.id,
        role: newRole,
      }, {
        onConflict: "user_id,role"
      });

    if (!error) {
      setRole(newRole);
    }

    return { error };
  };

  return { role, loading, setUserRole };
};
