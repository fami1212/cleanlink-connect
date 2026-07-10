import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, TrendingUp, Camera, Star, MessageSquare, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Row = { event_type: string; status: string; created_at: string };

const LABELS: Record<string, { label: string; icon: any; color: string }> = {
  estimate: { label: "Estimations", icon: TrendingUp, color: "text-primary" },
  photo_analysis: { label: "Analyses photo", icon: Camera, color: "text-accent" },
  review_summary: { label: "Résumés d'avis", icon: Star, color: "text-amber-500" },
  assistant_message: { label: "Messages Léa", icon: MessageSquare, color: "text-emerald-500" },
};

const AiUsage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: events }, { count }] = await Promise.all([
        (supabase.from("ai_usage_events") as any)
          .select("event_type,status,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(500),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("client_id", user.id),
      ]);
      setRows((events as Row[]) || []);
      setOrderCount(count || 0);
      setLoading(false);
    })();
  }, [user]);

  const byType = rows.reduce<Record<string, { total: number; success: number; error: number; degraded: number }>>((acc, r) => {
    const t = r.event_type;
    if (!acc[t]) acc[t] = { total: 0, success: 0, error: 0, degraded: 0 };
    acc[t].total++;
    if (r.status === "success") acc[t].success++;
    else if (r.status === "rate_limited" || r.status === "no_credits" || r.status === "network") acc[t].degraded++;
    else acc[t].error++;
    return acc;
  }, {});

  const total = rows.length;
  const successRate = total > 0 ? Math.round((rows.filter(r => r.status === "success").length / total) * 100) : 0;
  const estimatesUsed = byType.estimate?.success || 0;
  const conversionHint = estimatesUsed > 0 ? Math.round((orderCount / estimatesUsed) * 100) : 0;

  const last14days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().split("T")[0];
    const count = rows.filter(r => r.created_at.startsWith(key)).length;
    return { day: d.getDate(), count };
  });
  const maxCount = Math.max(1, ...last14days.map(d => d.count));

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <div className="sticky top-0 z-30 glass-strong border-b border-border/40 safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass flex items-center justify-center ring-1 ring-border/60">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">Analytics</p>
            <h1 className="font-display text-lg font-bold tracking-tight">Usage IA Léa</h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Hero KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 bg-gradient-hero-dark text-white noise relative overflow-hidden">
              <Sparkles className="w-4 h-4 text-accent mb-2" />
              <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Interactions IA</p>
              <p className="font-display text-3xl font-bold text-aurora mt-1">{total}</p>
            </div>
            <div className="rounded-2xl p-4 bg-card border border-border">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Taux de succès</p>
              <p className="font-display text-3xl font-bold text-foreground mt-1">{successRate}%</p>
            </div>
          </div>

          {/* Impact card */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-2">Impact réservations</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-foreground">{orderCount}</span>
              <span className="text-xs text-muted-foreground">commandes créées</span>
            </div>
            {estimatesUsed > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Ratio estimations IA → commandes : <strong className="text-foreground">{conversionHint}%</strong>
              </p>
            )}
          </div>

          {/* Per-feature breakdown */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">Par fonctionnalité</p>
            {Object.keys(LABELS).map((key) => {
              const s = byType[key] || { total: 0, success: 0, error: 0, degraded: 0 };
              const meta = LABELS[key];
              const Icon = meta.icon;
              return (
                <div key={key} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                      <span className="font-semibold text-sm text-foreground">{meta.label}</span>
                    </div>
                    <span className="font-display text-xl font-bold text-foreground">{s.total}</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                    {s.total > 0 && (
                      <>
                        <div className="bg-emerald-500" style={{ width: `${(s.success / s.total) * 100}%` }} />
                        <div className="bg-amber-500" style={{ width: `${(s.degraded / s.total) * 100}%` }} />
                        <div className="bg-destructive" style={{ width: `${(s.error / s.total) * 100}%` }} />
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                    <span>✅ {s.success} succès</span>
                    <span>⚠️ {s.degraded} dégradé</span>
                    <span>❌ {s.error} échec</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 14-day activity */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Activité 14 derniers jours</p>
            <div className="flex items-end gap-1 h-24">
              {last14days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary to-accent transition-all"
                    style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? "4px" : "2px", opacity: d.count > 0 ? 1 : 0.15 }}
                  />
                  <span className="text-[9px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {total === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Aucune interaction IA pour le moment. Utilisez Léa depuis l'écran de commande pour voir les statistiques ici.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiUsage;
