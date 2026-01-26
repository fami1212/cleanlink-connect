import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMyProvider } from "./useProviders";

interface ProviderStats {
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalEarnings: number;
  todayMissions: number;
  weekMissions: number;
  monthMissions: number;
  totalMissions: number;
  averageRating: number;
  totalReviews: number;
}

interface DailyEarning {
  date: string;
  amount: number;
  missions: number;
}

export const useProviderStats = () => {
  const { provider } = useMyProvider();
  const [stats, setStats] = useState<ProviderStats>({
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    totalEarnings: 0,
    todayMissions: 0,
    weekMissions: 0,
    monthMissions: 0,
    totalMissions: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [dailyEarnings, setDailyEarnings] = useState<DailyEarning[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!provider) return;

    setLoading(true);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Fetch all completed orders for this provider
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("provider_id", provider.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Error fetching provider stats:", error);
      setLoading(false);
      return;
    }

    const completedOrders = orders || [];

    // Calculate stats
    let todayEarnings = 0;
    let weekEarnings = 0;
    let monthEarnings = 0;
    let totalEarnings = 0;
    let todayMissions = 0;
    let weekMissions = 0;
    let monthMissions = 0;
    let totalRating = 0;
    let reviewCount = 0;

    const earningsByDate: Record<string, { amount: number; missions: number }> = {};

    completedOrders.forEach((order) => {
      const price = order.final_price || 0;
      const completedAt = order.completed_at ? new Date(order.completed_at) : null;
      
      totalEarnings += price;

      if (completedAt) {
        const dateKey = completedAt.toISOString().split("T")[0];
        
        if (!earningsByDate[dateKey]) {
          earningsByDate[dateKey] = { amount: 0, missions: 0 };
        }
        earningsByDate[dateKey].amount += price;
        earningsByDate[dateKey].missions += 1;

        if (completedAt >= new Date(todayStart)) {
          todayEarnings += price;
          todayMissions += 1;
        }
        if (completedAt >= new Date(weekStart)) {
          weekEarnings += price;
          weekMissions += 1;
        }
        if (completedAt >= new Date(monthStart)) {
          monthEarnings += price;
          monthMissions += 1;
        }
      }

      if (order.rating) {
        totalRating += order.rating;
        reviewCount += 1;
      }
    });

    // Convert earnings by date to array
    const dailyEarningsArray: DailyEarning[] = Object.entries(earningsByDate)
      .map(([date, data]) => ({
        date,
        amount: data.amount,
        missions: data.missions,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30); // Last 30 days

    setStats({
      todayEarnings,
      weekEarnings,
      monthEarnings,
      totalEarnings,
      todayMissions,
      weekMissions,
      monthMissions,
      totalMissions: completedOrders.length,
      averageRating: reviewCount > 0 ? Math.round((totalRating / reviewCount) * 10) / 10 : 0,
      totalReviews: reviewCount,
    });

    setDailyEarnings(dailyEarningsArray);
    setLoading(false);
  }, [provider]);

  useEffect(() => {
    if (provider) {
      fetchStats();
    }
  }, [provider, fetchStats]);

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  return {
    stats,
    dailyEarnings,
    loading,
    refetch: fetchStats,
    formatPrice,
  };
};
