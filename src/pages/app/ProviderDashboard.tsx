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
    if (!providerLoading && !provider && user) navigate("/app/provider/register");
  }, [provider, providerLoading, user, navigate]);

  useEffect(() => {
    if (pendingOrders.length > prevPendingCountRef.current && soundEnabled && provider?.is_online) playSound();
    prevPendingCountRef.current = pendingOrders.length;
  }, [pendingOrders.length, soundEnabled, provider?.is_online, playSound]);

  const handleToggleOnline = async (online: boolean) => {
    setIsUpdatingStatus(true);
    if (online) { try { await getCurrentPosition(); } catch {} }
    const { error } = await updateProvider({ is_online: online });
    setIsUpdatingStatus(false);
    if (error) { toast({ title: "Erreur", description: "Impossible de changer le statut", variant: "destructive" }); }
    else { toast({ title: online ? "En ligne ✓" : "Hors ligne", description: online ? "Vous recevez des missions" : "Vous ne recevrez plus de missions" }); }
  };

  const handleAcceptMission = async (orderId: string) => {
    setIsAccepting(true);
    const { error } = await acceptOrder(orderId);
    setIsAccepting(false);
    if (error) { toast({ title: "Erreur", description: "Impossible d'accepter la mission", variant: "destructive" }); }
    else { toast({ title: "Mission acceptée! 🎉", description: "Rendez-vous chez le client" }); navigate("/app/provider/mission"); }
  };

  const handleRefuseMission = async (orderId: string) => {
    await refuseOrder(orderId);
    toast({ title: "Mission refusée", description: "Cette mission ne sera plus affichée" });
  };

  const loading = providerLoading || ordersLoading || statsLoading;
  if (loading || !provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card safe-area-top border-b border-border">
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-9" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => { initializeAudio(); toggleSound(); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${soundEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <NotificationBell />
            <button onClick={() => navigate("/app/provider/profile")} className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-primary-foreground">{initials}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Online status */}
      <div className="p-4">
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
          provider.is_online ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${provider.is_online ? "bg-primary" : "bg-muted-foreground"}`}>
              {provider.is_online && <motion.div className="w-full h-full rounded-full bg-primary" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />}
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">{provider.is_online ? "En ligne" : "Hors ligne"}</p>
              <p className="text-xs text-muted-foreground">{provider.is_online ? "Vous recevez des missions" : "Activez pour recevoir"}</p>
            </div>
          </div>
          <Switch checked={provider.is_online || false} onCheckedChange={handleToggleOnline} disabled={isUpdatingStatus} />
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: TrendingUp, label: "Missions", value: String(stats.todayMissions), onClick: undefined },
            { icon: Wallet, label: "Gains", value: formatPrice(stats.todayEarnings), onClick: () => navigate("/app/provider/earnings") },
            { icon: Star, label: "Note", value: stats.averageRating > 0 ? String(stats.averageRating) : "-", onClick: () => navigate("/app/provider/reviews") },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={stat.onClick}
              className="bg-card border border-border rounded-2xl p-3.5 text-center hover:shadow-card transition-shadow"
            >
              <stat.icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
              <p className="font-display font-bold text-foreground text-sm">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active mission */}
      <AnimatePresence>
        {activeOrder && (
          <motion.div className="px-4 pb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <button onClick={() => navigate("/app/provider/mission")} className="w-full bg-primary rounded-2xl p-4 flex items-center gap-3 shadow-green">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white text-sm">Mission en cours</p>
                <p className="text-xs text-white/70 capitalize">{activeOrder.status === "accepted" ? "Acceptée" : "En route"}</p>
              </div>
              <span className="text-white/70 text-sm font-medium">Voir →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available missions */}
      <div className="px-4">
        <h2 className="font-display text-base font-bold text-foreground mb-3">
          {pendingOrders.length > 0 ? `Nouvelles missions (${pendingOrders.length})` : "Missions disponibles"}
        </h2>

        {provider.is_online ? (
          pendingOrders.length > 0 ? (
            <div className="space-y-3">
              {pendingOrders.slice(0, 3).map((order) => (
                <MissionCard key={order.id} order={order} onAccept={() => handleAcceptMission(order.id)} onRefuse={() => handleRefuseMission(order.id)} isLoading={isAccepting} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-display font-semibold text-foreground text-sm mb-1">Aucune mission</p>
              <p className="text-xs text-muted-foreground">Restez en ligne pour en recevoir</p>
            </div>
          )
        ) : (
          <div className="bg-muted/50 border border-dashed border-border rounded-2xl p-8 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="font-display font-semibold text-foreground text-sm mb-1">Hors ligne</p>
            <p className="text-xs text-muted-foreground">Activez pour recevoir des missions</p>
          </div>
        )}
      </div>

      {/* Recent */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-foreground">Récentes</h2>
          <button onClick={() => navigate("/app/provider/earnings")} className="text-xs text-primary font-medium">Voir tout</button>
        </div>

        {completedOrders.length > 0 ? (
          <div className="space-y-2">
            {completedOrders.slice(0, 3).map((order) => {
              const d = order.completed_at ? new Date(order.completed_at) : null;
              const label = d?.toDateString() === new Date().toDateString() ? "Aujourd'hui" : d?.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) || "";
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/8 rounded-lg flex items-center justify-center"><Check className="w-4 h-4 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{serviceLabels[order.service_type] || order.service_type}</p>
                    <p className="text-xs text-muted-foreground truncate">{order.address?.split(",")[0]} • {label}</p>
                  </div>
                  <span className="font-display font-bold text-primary text-xs">{formatPrice(order.final_price || 0)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <p className="text-xs text-muted-foreground">Pas de missions récentes</p>
          </div>
        )}
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;
