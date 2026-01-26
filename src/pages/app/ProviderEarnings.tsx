import { useState } from "react";
import { ArrowLeft, TrendingUp, Calendar, Wallet, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      case "today":
        return { earnings: stats.todayEarnings, missions: stats.todayMissions };
      case "week":
        return { earnings: stats.weekEarnings, missions: stats.weekMissions };
      case "month":
        return { earnings: stats.monthEarnings, missions: stats.monthMissions };
      case "total":
        return { earnings: stats.totalEarnings, missions: stats.totalMissions };
    }
  };

  const currentStats = getEarningsForPeriod();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/app/provider")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-display text-lg font-semibold text-white">
            Mes revenus
          </h1>
        </div>

        {/* Period selector */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 bg-white/10 rounded-xl p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? "bg-white text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main earnings display */}
        <div className="px-4 pb-6 text-center">
          <p className="text-white/80 text-sm mb-1">Gains totaux</p>
          <p className="font-display text-4xl font-bold text-white mb-2">
            {formatPrice(currentStats.earnings)}
          </p>
          <p className="text-white/80 text-sm">
            {currentStats.missions} mission{currentStats.missions > 1 ? "s" : ""} terminée{currentStats.missions > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Moyenne/mission</span>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              {currentStats.missions > 0
                ? formatPrice(Math.round(currentStats.earnings / currentStats.missions))
                : "0 FCFA"}
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">En attente</span>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              {formatPrice(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Daily earnings list */}
      <div className="px-4 py-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Historique des gains
        </h2>

        {dailyEarnings.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center border border-border">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun historique de gains</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dailyEarnings.map((day) => (
              <div
                key={day.date}
                className="bg-card rounded-xl p-4 border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(day.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.missions} mission{day.missions > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-primary">
                    {formatPrice(day.amount)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
