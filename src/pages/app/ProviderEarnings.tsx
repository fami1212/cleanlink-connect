import { useState } from "react";
import { ArrowLeft, TrendingUp, Calendar, Wallet, ChevronRight, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProviderStats } from "@/hooks/useProviderStats";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";

type Period = "today" | "week" | "month" | "total";

const ProviderEarnings = () => {
  const navigate = useNavigate();
  const { stats, dailyEarnings, loading, formatPrice } = useProviderStats();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  const periods: { value: Period; label: string }[] = [
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "7 jours" },
    { value: "month", label: "Ce mois" },
    { value: "total", label: "Total" },
  ];

  const getEarningsForPeriod = () => {
    switch (selectedPeriod) {
      case "today": return { earnings: stats.todayEarnings, missions: stats.todayMissions };
      case "week": return { earnings: stats.weekEarnings, missions: stats.weekMissions };
      case "month": return { earnings: stats.monthEarnings, missions: stats.monthMissions };
      case "total": return { earnings: stats.totalEarnings, missions: stats.totalMissions };
    }
  };

  const currentStats = getEarningsForPeriod();
  const trend = currentStats.earnings > 0 ? 12.5 : 0;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><motion.div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate("/app/provider")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-display text-lg font-bold text-white">Mes revenus</h1>
        </div>

        {/* Period tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setSelectedPeriod(p.value)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedPeriod === p.value ? "bg-white text-primary shadow" : "text-white/70"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main amount */}
        <div className="px-4 pb-8 text-center">
          <p className="text-white/60 text-xs mb-1">Gains totaux</p>
          <motion.p
            className="font-display text-4xl font-bold text-white mb-2"
            key={currentStats.earnings}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {formatPrice(currentStats.earnings)}
          </motion.p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-white/60 text-xs">{currentStats.missions} mission{currentStats.missions > 1 ? "s" : ""}</span>
            {trend > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-accent bg-accent/20 px-2 py-0.5 rounded-full font-medium">
                <ArrowUpRight className="w-3 h-3" />+{trend}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-3 relative z-10 grid grid-cols-2 gap-2.5">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <TrendingUp className="w-4 h-4 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-0.5">Moyenne/mission</p>
          <p className="font-display text-lg font-bold text-foreground">
            {currentStats.missions > 0 ? formatPrice(Math.round(currentStats.earnings / currentStats.missions)) : "0 FCFA"}
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <Wallet className="w-4 h-4 text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-0.5">En attente</p>
          <p className="font-display text-lg font-bold text-foreground">{formatPrice(0)}</p>
        </div>
      </div>

      {/* History */}
      <div className="px-4 py-6">
        <h2 className="font-display text-base font-bold text-foreground mb-3">Historique</h2>
        {dailyEarnings.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border border-border">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Aucun historique</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dailyEarnings.map((day) => (
              <div key={day.date} className="bg-card rounded-xl p-3.5 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/8 rounded-lg flex items-center justify-center"><Calendar className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">{new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</p>
                    <p className="text-xs text-muted-foreground">{day.missions} mission{day.missions > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-primary text-sm">{formatPrice(day.amount)}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderEarnings;
