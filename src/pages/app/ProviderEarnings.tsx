import { useState } from "react";
import { ArrowLeft, TrendingUp, Calendar, Wallet, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
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

  // Calculate trend (mock for now)
  const trend = currentStats.earnings > 0 ? 12.5 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-24">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-br from-primary via-linkeco-green-light to-accent safe-area-top relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 p-4">
            <motion.button
              onClick={() => navigate("/app/provider")}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            <h1 className="font-display text-xl font-bold text-white">
              Mes revenus
            </h1>
          </div>

          {/* Period selector */}
          <div className="px-4 pb-4">
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-1.5">
              {periods.map((period) => (
                <motion.button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedPeriod === period.value
                      ? "bg-white text-primary shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {period.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main earnings display */}
          <motion.div 
            className="px-4 pb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white/80 text-sm mb-2">Gains totaux</p>
            <motion.p 
              className="font-display text-4xl md:text-5xl font-bold text-white mb-3"
              key={currentStats.earnings}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {formatPrice(currentStats.earnings)}
            </motion.p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-sm">
                {currentStats.missions} mission{currentStats.missions > 1 ? "s" : ""}
              </span>
              {trend > 0 && (
                <span className="inline-flex items-center gap-1 text-sm text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{trend}%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div 
        className="px-4 -mt-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            className="bg-card rounded-2xl p-4 border border-border shadow-lg"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Moyenne/mission</p>
            <p className="font-display text-xl font-bold text-foreground">
              {currentStats.missions > 0
                ? formatPrice(Math.round(currentStats.earnings / currentStats.missions))
                : "0 FCFA"}
            </p>
          </motion.div>

          <motion.div 
            className="bg-card rounded-2xl p-4 border border-border shadow-lg"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">En attente</p>
            <p className="font-display text-xl font-bold text-foreground">
              {formatPrice(0)}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Daily earnings list */}
      <motion.div 
        className="px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-lg font-bold text-foreground mb-4">
          Historique des gains
        </h2>

        {dailyEarnings.length === 0 ? (
          <motion.div 
            className="bg-card rounded-2xl p-8 text-center border border-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground">Aucun historique de gains</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {dailyEarnings.map((day, index) => (
              <motion.div
                key={day.date}
                className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground capitalize">
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
                  <span className="font-display font-bold text-primary">
                    {formatPrice(day.amount)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderEarnings;
