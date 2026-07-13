import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Truck, ShoppingBag, TrendingUp, ShieldCheck, MessageSquareWarning, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Kpis {
  totalUsers: number;
  totalProviders: number;
  pendingProviders: number;
  totalOrders: number;
  completedOrders: number;
  revenue: number;
  flaggedReviews: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<Kpis | null>(null);

  useEffect(() => {
    (async () => {
      const [users, providers, pending, orders, completed, revenue, flagged] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("providers").select("*", { count: "exact", head: true }),
        (supabase.from("providers") as any).select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("orders").select("final_price").eq("status", "completed"),
        (supabase.from("orders") as any).select("*", { count: "exact", head: true }).not("review_flag_reason", "is", null),
      ]);
      setKpis({
        totalUsers: users.count ?? 0,
        totalProviders: providers.count ?? 0,
        pendingProviders: pending.count ?? 0,
        totalOrders: orders.count ?? 0,
        completedOrders: completed.count ?? 0,
        revenue: (revenue.data ?? []).reduce((s: number, o: any) => s + (o.final_price || 0), 0),
        flaggedReviews: flagged.count ?? 0,
      });
    })();
  }, []);

  const cards = kpis
    ? [
        { icon: Users, label: "Utilisateurs", value: kpis.totalUsers, color: "text-primary" },
        { icon: Truck, label: "Prestataires", value: kpis.totalProviders, color: "text-emerald-600" },
        { icon: ShieldCheck, label: "À valider", value: kpis.pendingProviders, color: "text-accent", href: "/app/admin/providers" },
        { icon: ShoppingBag, label: "Commandes", value: kpis.totalOrders, color: "text-blue-600" },
        { icon: TrendingUp, label: "CA (FCFA)", value: kpis.revenue.toLocaleString("fr-FR"), color: "text-emerald-700" },
        { icon: MessageSquareWarning, label: "Avis signalés", value: kpis.flaggedReviews, color: "text-red-600", href: "/app/admin/reviews" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      <header className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate("/app")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">Admin Link'eco</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {!kpis ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {cards.map((c) => (
                <button
                  key={c.label}
                  onClick={() => c.href && navigate(c.href)}
                  className="text-left bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  <c.icon className={`w-6 h-6 ${c.color} mb-2`} />
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="text-2xl font-display font-bold">{c.value}</div>
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              <button onClick={() => navigate("/app/admin/providers")} className="w-full flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="font-medium">Validation prestataires</span>
                </div>
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">{kpis.pendingProviders} en attente</span>
              </button>
              <button onClick={() => navigate("/app/admin/reviews")} className="w-full flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <MessageSquareWarning className="w-5 h-5 text-primary" />
                  <span className="font-medium">Modération avis</span>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{kpis.flaggedReviews}</span>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
