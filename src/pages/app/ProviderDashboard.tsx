import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, TrendingUp, Wallet, Volume2, Check } from "lucide-react";
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

  // Redirect to register if not a provider
  useEffect(() => {
    if (!providerLoading && !provider && user) {
      navigate("/app/provider/register");
    }
  }, [provider, providerLoading, user, navigate]);

  // Play sound when new missions arrive
  useEffect(() => {
    if (pendingOrders.length > prevPendingCountRef.current && soundEnabled && provider?.is_online) {
      playSound();
    }
    prevPendingCountRef.current = pendingOrders.length;
  }, [pendingOrders.length, soundEnabled, provider?.is_online, playSound]);

  const handleToggleOnline = async (online: boolean) => {
    setIsUpdatingStatus(true);
    
    if (online) {
      // Get current position when going online
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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

  const statItems = [
    { icon: TrendingUp, label: "Missions aujourd'hui", value: String(stats.todayMissions) },
    { icon: Wallet, label: "Gains aujourd'hui", value: formatPrice(stats.todayEarnings) },
    { icon: Star, label: "Note moyenne", value: stats.averageRating > 0 ? String(stats.averageRating) : "-" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card safe-area-top">
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-10" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                initializeAudio();
                toggleSound();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                soundEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <NotificationBell />
            <button
              onClick={() => navigate("/app/provider/profile")}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary-foreground">{initials}</span>
              )}
            </button>
          </div>
        </div>

        {/* Online status */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${provider.is_online ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <div>
                <p className="font-medium text-foreground">
                  {provider.is_online ? "En ligne" : "Hors ligne"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {provider.is_online ? "Prêt à recevoir des missions" : "Vous ne recevez pas de missions"}
                </p>
              </div>
            </div>
            <Switch 
              checked={provider.is_online || false} 
              onCheckedChange={handleToggleOnline}
              disabled={isUpdatingStatus}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {statItems.map((stat) => (
            <button
              key={stat.label}
              onClick={() => {
                if (stat.icon === Wallet) navigate("/app/provider/earnings");
                if (stat.icon === Star) navigate("/app/provider/reviews");
              }}
              className="bg-card border border-border rounded-xl p-3 text-center hover:border-primary/50 transition-colors"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-foreground text-sm truncate">{stat.value}</p>
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active mission banner */}
      {activeOrder && (
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate("/app/provider/mission")}
            className="w-full bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-lg">🚛</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Mission en cours</p>
              <p className="text-sm text-muted-foreground capitalize">
                {activeOrder.status === "accepted" ? "Acceptée" : "En route"}
              </p>
            </div>
            <span className="text-accent font-medium">Voir →</span>
          </button>
        </div>
      )}
      <div className="px-4">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          {pendingOrders.length > 0 ? "Nouvelles missions" : "Missions disponibles"}
        </h2>

        {provider.is_online ? (
          pendingOrders.length > 0 ? (
            <div className="space-y-4">
              {pendingOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="animate-pulse-slow">
                  <MissionCard
                    order={order}
                    onAccept={() => handleAcceptMission(order.id)}
                    onRefuse={() => handleRefuseMission(order.id)}
                    isLoading={isAccepting}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Aucune mission disponible
              </h3>
              <p className="text-sm text-muted-foreground">
                Restez en ligne pour recevoir de nouvelles missions
              </p>
            </div>
          )
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Vous êtes hors ligne
            </h3>
            <p className="text-sm text-muted-foreground">
              Activez votre statut pour recevoir des missions
            </p>
          </div>
        )}
      </div>

      {/* Recent missions */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-foreground">
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
            {completedOrders.slice(0, 3).map((order) => {
              const completedDate = order.completed_at ? new Date(order.completed_at) : null;
              const isToday = completedDate && 
                completedDate.toDateString() === new Date().toDateString();
              const dateLabel = isToday 
                ? "Aujourd'hui" 
                : completedDate?.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) || "";
              
              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {serviceLabels[order.service_type] || order.service_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.address?.split(",")[0]} • {dateLabel}
                    </p>
                  </div>
                  <span className="font-display font-semibold text-primary">
                    {formatPrice(order.final_price || 0)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground">Pas de missions récentes</p>
          </div>
        )}
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;
