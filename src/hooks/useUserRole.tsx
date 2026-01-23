import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { UserRole } from "@/types/database";

export type { UserRole } from "@/types/database";

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching roles:", error);
      } else {
        const userRoles = (data || []).map((r) => r.role as UserRole);
        setRoles(userRoles.length > 0 ? userRoles : []);
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user]);

  const addRole = async (newRole: UserRole) => {
    if (!user) return { error: new Error("Not authenticated") };

    // Check if role already exists
    if (roles.includes(newRole)) {
      return { error: null };
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: user.id,
        role: newRole,
      });

    if (!error) {
      setRoles((prev) => [...prev, newRole]);
    }

    return { error };
  };

  const hasRole = (role: UserRole) => {
    return roles.includes(role);
  };

  // Primary role for backwards compatibility
  const role = roles[0] || "client";

  const setUserRole = async (newRole: UserRole) => {
    return addRole(newRole);
  };

  return { roles, role, loading, addRole, hasRole, setUserRole };
};
