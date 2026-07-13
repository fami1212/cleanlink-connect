import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2, ShieldCheck, Download, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, providers: 0 });

  useEffect(() => {
    (async () => {
      const [ordersRes, completedRes, providersRes, recentOrders] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("providers").select("*", { count: "exact", head: true }).eq("is_verified", true),
        supabase.from("orders").select("id, service_type, status, address, latitude, longitude, completed_at, created_at, provider_id")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      setStats({
        total: ordersRes.count ?? 0,
        completed: completedRes.count ?? 0,
        providers: providersRes.count ?? 0,
      });
      setOrders(recentOrders.data ?? []);
      setLoading(false);
    })();
  }, []);

  const exportCsv = () => {
    const headers = ["id", "service_type", "status", "address", "latitude", "longitude", "created_at", "completed_at"];
    const rows = orders.map((o) => headers.map((h) => JSON.stringify((o as any)[h] ?? "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkeco-tracabilite-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-8">
      <header className="bg-gradient-emerald text-primary-foreground safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate("/app")} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h1 className="font-display text-lg font-semibold">Autorité ONAS</h1>
          </div>
        </div>
        <div className="px-4 pb-4">
          <p className="text-sm opacity-90">Traçabilité réglementaire · Sénégal</p>
        </div>
      </header>

      <main className="p-4 space-y-4 -mt-2">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Missions", value: stats.total },
                { label: "Terminées", value: stats.completed },
                { label: "Prestataires ✓", value: stats.providers },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
                  <div className="text-2xl font-display font-bold text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="font-display font-semibold">Dernières missions</h2>
              <Button size="sm" variant="outline" onClick={exportCsv}>
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
            </div>

            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="bg-card border border-border rounded-xl p-3 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="font-medium capitalize">{o.service_type.replace("_", " ")}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      o.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{o.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {o.address}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Date(o.created_at).toLocaleString("fr-FR")}
                    {o.latitude && ` · ${Number(o.latitude).toFixed(4)}, ${Number(o.longitude).toFixed(4)}`}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AuthorityDashboard;
