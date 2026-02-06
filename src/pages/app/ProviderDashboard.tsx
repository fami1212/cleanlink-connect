import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, TrendingUp, Wallet, Volume2, Check, Zap, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useMyProvider } from "@/hooks/useProviders";
import { useProviderOrders } from "@/hooks/useProviderOrders";
import { useProviderStats } from "@/hooks/useProviderStats";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import MissionCard from "@/components/app/MissionCard";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";
import NotificationBell from "@/components/app/NotificationBell";
import logo from "@/assets/linkeco-logo.png";
import { toast } from "@/hooks/use-toast";

const serviceLabels: Record<string, string> = {
  fosse_septique: "Vidange fosse septique",
  latrines: "Vidange latrines",
  urgence: "Intervention urgente",
  curage: "Curage canalisation",
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { provider, updateProvider, loading: providerLoading } = useMyProvider();
  const { pendingOrders, activeOrder, completedOrders, loading: ordersLoading, acceptOrder, refuseOrder } = useProviderOrders();
  const { stats, formatPrice, loading: statsLoading } = useProviderStats();
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();
  const { getCurrentPosition } = useGeolocation({ enableTracking: provider?.is_online });
  const { soundEnabled, toggleSound, playSound, initializeAudio } = useNotificationSound();
  
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const prevPendingCountRef = useRef(pendingOrders.length);

  useEffect(() => {
    if (!providerLoading && !provider && user) {
      navigate("/app/provider/register");
    }
  }, [provider, providerLoading, user, navigate]);

  useEffect(() => {
    if (pendingOrders.length > prevPendingCountRef.current && soundEnabled && provider?.is_online) {
      playSound();
    }
    prevPendingCountRef.current = pendingOrders.length;
  }, [pendingOrders.length, soundEnabled, provider?.is_online, playSound]);

  const handleToggleOnline = async (online: boolean) => {
    setIsUpdatingStatus(true);
    
    if (online) {
      try {
        await getCurrentPosition();
      } catch (err) {
        console.log("Could not get position:", err);
      }
    }
    
    const { error } = await updateProvider({ is_online: online });
    setIsUpdatingStatus(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut",
        variant: "destructive",
      });
    } else {
      toast({
        title: online ? "Vous êtes en ligne" : "Vous êtes hors ligne",
        description: online ? "Vous pouvez recevoir des missions" : "Vous ne recevrez plus de missions",
      });
    }
  };

  const handleAcceptMission = async (orderId: string) => {
    setIsAccepting(true);
    const { error } = await acceptOrder(orderId);
    setIsAccepting(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la mission",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Mission acceptée! 🎉",
        description: "Rendez-vous chez le client",
      });
      navigate("/app/provider/mission");
    }
  };

  const handleRefuseMission = async (orderId: string) => {
    await refuseOrder(orderId);
    toast({
      title: "Mission refusée",
      description: "Cette mission ne sera plus affichée",
    });
  };

  const loading = providerLoading || ordersLoading || statsLoading;

  if (loading || !provider) {
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

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

  const statItems = [
    { icon: TrendingUp, label: "Missions", value: String(stats.todayMissions), color: "primary" },
    { icon: Wallet, label: "Gains", value: formatPrice(stats.todayEarnings), color: "accent" },
    { icon: Star, label: "Note", value: stats.averageRating > 0 ? String(stats.averageRating) : "-", color: "secondary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-24">
      {/* Header */}
      <motion.div 
        className="bg-card safe-area-top shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-10" />
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => {
                initializeAudio();
                toggleSound();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                soundEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>
            <NotificationBell />
            <motion.button
              onClick={() => navigate("/app/provider/profile")}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary-foreground">{initials}</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Online status */}
        <motion.div 
          className="px-4 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
            provider.is_online 
              ? "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20" 
              : "bg-muted/50 border border-border"
          }`}>
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-4 h-4 rounded-full ${provider.is_online ? "bg-primary" : "bg-muted-foreground"}`}
                animate={provider.is_online ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div>
                <p className="font-semibold text-foreground">
                  {provider.is_online ? "En ligne" : "Hors ligne"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {provider.is_online ? "Prêt à recevoir des missions" : "Activez pour recevoir des missions"}
                </p>
              </div>
            </div>
            <Switch 
              checked={provider.is_online || false} 
              onCheckedChange={handleToggleOnline}
              disabled={isUpdatingStatus}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="px-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-3 gap-3">
          {statItems.map((stat, index) => (
            <motion.button
              key={stat.label}
              onClick={() => {
                if (stat.icon === Wallet) navigate("/app/provider/earnings");
                if (stat.icon === Star) navigate("/app/provider/reviews");
              }}
              className={`bg-card border rounded-2xl p-4 text-center hover:shadow-md transition-all ${
                stat.color === "primary" ? "border-primary/20 hover:border-primary/40" :
                stat.color === "accent" ? "border-accent/20 hover:border-accent/40" :
                "border-secondary/20 hover:border-secondary/40"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                stat.color === "primary" ? "bg-primary/10" :
                stat.color === "accent" ? "bg-accent/10" : "bg-secondary/10"
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === "primary" ? "text-primary" :
                  stat.color === "accent" ? "text-accent" : "text-secondary"
                }`} />
              </div>
              <p className="font-display font-bold text-foreground text-sm truncate">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active mission banner */}
      <AnimatePresence>
        {activeOrder && (
          <motion.div 
            className="px-4 pb-4"
            initial={{ opacity: 0, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
          >
            <motion.button
              onClick={() => navigate("/app/provider/mission")}
              className="w-full bg-gradient-to-r from-accent to-primary rounded-2xl p-4 flex items-center gap-4 shadow-lg"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div 
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">Mission en cours</p>
                <p className="text-sm text-white/80 capitalize">
                  {activeOrder.status === "accepted" ? "Acceptée - En attente" : "En route vers le client"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-white font-medium">
                <span>Voir</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available missions */}
      <motion.div 
        className="px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display text-lg font-bold text-foreground mb-3">
          {pendingOrders.length > 0 ? `Nouvelles missions (${pendingOrders.length})` : "Missions disponibles"}
        </h2>

        {provider.is_online ? (
          pendingOrders.length > 0 ? (
            <div className="space-y-4">
              {pendingOrders.slice(0, 3).map((order, index) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                >
                  <MissionCard
                    order={order}
                    onAccept={() => handleAcceptMission(order.id)}
                    onRefuse={() => handleRefuseMission(order.id)}
                    isLoading={isAccepting}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="bg-card border border-border rounded-2xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div 
                className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Aucune mission disponible
              </h3>
              <p className="text-sm text-muted-foreground">
                Restez en ligne pour recevoir de nouvelles missions
              </p>
            </motion.div>
          )
        ) : (
          <motion.div 
            className="bg-card border border-dashed border-border rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Vous êtes hors ligne
            </h3>
            <p className="text-sm text-muted-foreground">
              Activez votre statut pour recevoir des missions
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Recent missions */}
      <motion.div 
        className="px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-foreground">
            Missions récentes
          </h2>
          <button
            onClick={() => navigate("/app/provider/earnings")}
            className="text-sm text-primary font-medium"
          >
            Voir tout
          </button>
        </div>
        
        {completedOrders.length > 0 ? (
          <div className="space-y-3">
            {completedOrders.slice(0, 3).map((order, index) => {
              const completedDate = order.completed_at ? new Date(order.completed_at) : null;
              const isToday = completedDate && 
                completedDate.toDateString() === new Date().toDateString();
              const dateLabel = isToday 
                ? "Aujourd'hui" 
                : completedDate?.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) || "";
              
              return (
                <motion.div
                  key={order.id}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {serviceLabels[order.service_type] || order.service_type}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.address?.split(",")[0]} • {dateLabel}
                    </p>
                  </div>
                  <span className="font-display font-bold text-primary text-sm">
                    {formatPrice(order.final_price || 0)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-muted-foreground">Pas de missions récentes</p>
          </div>
        )}
      </motion.div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;
