import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Check, Clock3, MapPin, Star, TrendingUp, Volume2, Wallet, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
    if (error) toast({ title: "Erreur", description: "Impossible de changer le statut", variant: "destructive" });
    else toast({ title: online ? "En ligne" : "Hors ligne", description: online ? "Vous recevez des missions" : "Vous ne recevrez plus de missions" });
  };

  const handleAcceptMission = async (orderId: string) => {
    setIsAccepting(true);
    const { error } = await acceptOrder(orderId);
    setIsAccepting(false);
    if (error) toast({ title: "Erreur", description: "Impossible d'accepter la mission", variant: "destructive" });
    else { toast({ title: "Mission acceptée", description: "Rendez-vous chez le client" }); navigate("/app/provider/mission"); }
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
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 border-b border-border/60 glass-strong safe-area-top">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div>
            <img src={logo} alt="Link'eco" className="h-8" />
            <p className="mt-1 text-xs text-muted-foreground">Espace prestataire</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"} onClick={() => { initializeAudio(); toggleSound(); }} className={soundEnabled ? "text-primary" : "text-muted-foreground"}>
              <Volume2 />
            </Button>
            <NotificationBell />
            <Button variant="ghost" size="icon" aria-label="Mon profil prestataire" onClick={() => navigate("/app/provider/profile")} className="overflow-hidden rounded-full bg-primary text-primary-foreground">
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs font-bold">{initials}</span>}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl">
        <section className="px-4 pt-6">
          <p className="text-sm text-muted-foreground">Bonjour{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">Votre activité</h1>
        </section>

        <section className="px-4 pt-5" aria-label="Disponibilité">
          <div className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors ${provider.is_online ? "border-primary/25 bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex min-w-0 items-center gap-3">
              <span className={`relative flex h-3 w-3 shrink-0 rounded-full ${provider.is_online ? "bg-primary" : "bg-muted-foreground"}`}>
                {provider.is_online && <motion.span className="absolute inset-0 rounded-full bg-primary" animate={{ scale: [1, 1.8], opacity: [0.45, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />}
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">{provider.is_online ? "Disponible" : "Indisponible"}</p>
                <p className="truncate text-xs text-muted-foreground">{provider.is_online ? "Les demandes arrivent ici" : "Activez pour recevoir des missions"}</p>
              </div>
            </div>
            <Switch checked={provider.is_online || false} onCheckedChange={handleToggleOnline} disabled={isUpdatingStatus} aria-label="Changer ma disponibilité" />
          </div>
        </section>

        <section className="px-4 pt-5" aria-label="Résumé du jour">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-foreground">Aujourd’hui</h2>
            <span className="text-xs text-muted-foreground">Votre activité récente</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-card">
            <div className="p-3 text-center">
              <TrendingUp className="mx-auto mb-1.5 h-4 w-4 text-primary" />
              <p className="font-display text-sm font-bold text-foreground">{stats.todayMissions}</p>
              <p className="text-[11px] text-muted-foreground">Missions</p>
            </div>
            <button onClick={() => navigate("/app/provider/earnings")} className="p-3 text-center transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Wallet className="mx-auto mb-1.5 h-4 w-4 text-accent" />
              <p className="truncate font-display text-sm font-bold text-foreground">{formatPrice(stats.todayEarnings).replace(" FCFA", " F")}</p>
              <p className="text-[11px] text-muted-foreground">Gains</p>
            </button>
            <button onClick={() => navigate("/app/provider/reviews")} className="p-3 text-center transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Star className="mx-auto mb-1.5 h-4 w-4 text-accent" />
              <p className="font-display text-sm font-bold text-foreground">{stats.averageRating > 0 ? stats.averageRating : "—"}</p>
              <p className="text-[11px] text-muted-foreground">Note</p>
            </button>
          </div>
        </section>

        <AnimatePresence>
          {activeOrder && (
            <motion.section className="px-4 pt-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
              <Button onClick={() => navigate("/app/provider/mission")} className="h-auto w-full justify-start rounded-xl bg-primary p-4 text-left text-primary-foreground shadow-green hover:bg-primary/90">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10"><Zap className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium uppercase">Mission en cours</span>
                  <span className="mt-0.5 block truncate font-display text-sm font-semibold">{activeOrder.status === "accepted" ? "En route vers le client" : "Intervention en cours"}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0" />
              </Button>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="px-4 pt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Demandes de mission</h2>
              <p className="text-xs text-muted-foreground">{pendingOrders.length ? `${pendingOrders.length} demande${pendingOrders.length > 1 ? "s" : ""} à examiner` : "Les nouvelles demandes apparaîtront ici"}</p>
            </div>
            {pendingOrders.length > 0 && <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">{pendingOrders.length}</span>}
          </div>

          {provider.is_online ? (
            pendingOrders.length > 0 ? (
              <div className="space-y-3">
                {pendingOrders.slice(0, 3).map((order) => <MissionCard key={order.id} order={order} onAccept={() => handleAcceptMission(order.id)} onRefuse={() => handleRefuseMission(order.id)} isLoading={isAccepting} />)}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-center">
                <MapPin className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-display text-sm font-semibold text-foreground">Aucune demande pour l’instant</p>
                <p className="mt-1 text-xs text-muted-foreground">Vous recevrez une alerte dès qu’une mission est disponible.</p>
              </div>
            )
          ) : (
            <div className="rounded-xl border border-border bg-muted/50 px-5 py-7 text-center">
              <Clock3 className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
              <p className="font-display text-sm font-semibold text-foreground">Vous êtes hors ligne</p>
              <p className="mt-1 text-xs text-muted-foreground">Passez disponible pour recevoir des demandes.</p>
            </div>
          )}
        </section>

        <section className="px-4 pb-6 pt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-foreground">Missions terminées</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/provider/earnings")} className="text-primary">Tout voir <ArrowUpRight className="ml-1 h-4 w-4" /></Button>
          </div>
          {completedOrders.length > 0 ? (
            <div className="divide-y divide-border rounded-xl border border-border bg-card px-3">
              {completedOrders.slice(0, 3).map((order) => {
                const completedDate = order.completed_at ? new Date(order.completed_at) : null;
                const dateLabel = completedDate?.toDateString() === new Date().toDateString() ? "Aujourd’hui" : completedDate?.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) || "";
                return (
                  <div key={order.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Check className="h-4 w-4 text-primary" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{serviceLabels[order.service_type] || order.service_type}</span>
                      <span className="block truncate text-xs text-muted-foreground">{order.address?.split(",")[0]} · {dateLabel}</span>
                    </span>
                    <span className="shrink-0 font-display text-xs font-bold text-primary">{formatPrice(order.final_price || 0)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card px-4 py-5 text-center text-xs text-muted-foreground">Vos missions terminées s’afficheront ici.</div>
          )}
        </section>
      </main>
      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDashboard;