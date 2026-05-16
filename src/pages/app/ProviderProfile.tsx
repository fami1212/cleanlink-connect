import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  FileCheck,
  MapPin,
  Settings,
  ChevronRight,
  LogOut,
  Camera,
  Loader2,
  Star,
  Zap,
  Shield,
  Wallet,
  Activity,
  MessageSquare,
  Bell,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Power,
} from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { useMyProvider } from "@/hooks/useProviders";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useProviderStats } from "@/hooks/useProviderStats";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useNotifications } from "@/hooks/useNotifications";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";
import { toast } from "@/hooks/use-toast";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { provider, updateProvider, loading } = useMyProvider();
  const { profile, updateProfile } = useProfile();
  const { uploadAvatar, uploading: avatarUploading } = useAvatarUpload();
  const { stats, formatPrice } = useProviderStats();
  const { unreadCount: unreadMessages } = useUnreadMessages();
  const { unreadCount: unreadNotifs } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [workZoneRadius, setWorkZoneRadius] = useState(provider?.work_zone_radius || 15);

  const handleToggleOnline = async (online: boolean) => {
    setIsUpdating(true);
    const { error } = await updateProvider({ is_online: online });
    setIsUpdating(false);
    if (error)
      toast({ title: "Erreur", description: "Impossible de changer le statut", variant: "destructive" });
    else
      toast({
        title: online ? "Vous êtes en ligne" : "Vous êtes hors ligne",
        description: online ? "Vous recevrez des missions" : "Vous ne recevrez plus de missions",
      });
  };

  const handleSaveWorkZone = async () => {
    setIsUpdating(true);
    const { error } = await updateProvider({ work_zone_radius: workZoneRadius } as any);
    setIsUpdating(false);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: `Zone de travail: ${workZoneRadius} km` });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Max 5 Mo", variant: "destructive" });
      return;
    }
    const { url, error } = await uploadAvatar(file);
    if (error) {
      toast({ title: "Erreur", description: "Erreur upload", variant: "destructive" });
      return;
    }
    if (url) {
      await updateProfile({ avatar_url: url });
      toast({ title: "Succès", description: "Photo mise à jour!" });
    }
  };

  const vehicleLabels: Record<string, string> = {
    camion_6000: "Camion citerne 6 000L",
    camion_10000: "Camion citerne 10 000L",
    camion_15000: "Camion citerne 15 000L",
    mini_citerne: "Mini citerne 3 000L",
    tricycle: "Tricycle motorisé",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const displayName = provider?.company_name || profile?.full_name || "Prestataire";
  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "P";
  const isOnline = provider?.is_online || false;
  const isDirty = workZoneRadius !== (provider?.work_zone_radius || 15);

  const menuItems = [
    {
      icon: FileCheck,
      label: "Documents & vérification",
      hint: provider?.is_verified ? "Compte vérifié" : "À compléter",
      path: "/app/provider/documents",
      accent: provider?.is_verified,
    },
    { icon: Star, label: "Mes avis clients", hint: `Note ${stats.averageRating > 0 ? stats.averageRating : "—"}/5`, path: "/app/provider/reviews" },
    { icon: TrendingUp, label: "Mes revenus", hint: "Détail des gains et paiements", path: "/app/provider/earnings" },
    { icon: Settings, label: "Modifier mon profil", hint: "Coordonnées et véhicule", path: "/app/profile/edit" },
  ];

  const supportItems = [
    {
      icon: MessageSquare,
      label: "Messages clients",
      path: "/app/conversations",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      icon: Bell,
      label: "Notifications & alertes",
      path: "/app/notifications",
      badge: unreadNotifs > 0 ? unreadNotifs : null,
    },
    { icon: HelpCircle, label: "Aide et support", path: "/app/help" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-accent safe-area-top overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-accent/30 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between px-4 pt-3">
            <button
              onClick={() => navigate("/app/provider")}
              className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="font-display text-base font-bold text-white">Mon profil pro</h1>
            <button
              onClick={() => navigate("/app")}
              className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm text-[11px] font-semibold text-white"
            >
              Mode client
            </button>
          </div>

          <div className="px-5 pt-4 pb-20">
            <div className="flex items-start gap-4">
              <div className="relative">
                <button
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-white/20"
                >
                  {avatarUploading ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-primary">{initials}</span>
                  )}
                </button>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span
                  className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    isOnline ? "bg-emerald-400" : "bg-muted-foreground"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <h2 className="font-display text-xl font-bold text-white truncate">{displayName}</h2>
                <p className="text-xs text-white/70 truncate">{user?.email}</p>
                <div className="flex items-center flex-wrap gap-1.5 mt-2">
                  {provider?.is_verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white bg-emerald-500/30 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" /> Vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white bg-amber-500/40 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3" /> En cours
                    </span>
                  )}
                  {stats.averageRating >= 4.5 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> Top pro
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute left-4 right-4 -bottom-8 z-10">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border rounded-2xl shadow-xl grid grid-cols-3 divide-x divide-border overflow-hidden"
          >
            <div className="p-3 text-center">
              <Zap className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="font-display text-lg font-bold text-foreground leading-none">{stats.totalMissions}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Missions</p>
            </div>
            <div className="p-3 text-center">
              <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="font-display text-lg font-bold text-foreground leading-none">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Note moyenne</p>
            </div>
            <div className="p-3 text-center">
              <Wallet className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="font-display text-base font-bold text-foreground leading-none truncate px-1">
                {formatPrice(stats.totalEarnings).replace(" FCFA", " F")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Revenus</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-10" />

      <div className="p-4 space-y-5">
        {/* Online status — premium card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 border transition-all overflow-hidden relative ${
            isOnline
              ? "bg-gradient-to-r from-emerald-500/10 via-primary/10 to-accent/10 border-primary/30"
              : "bg-card border-border"
          }`}
        >
          {isOnline && (
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />
          )}
          <div className="relative flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                isOnline ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-bold text-foreground">
                  {isOnline ? "En ligne" : "Hors ligne"}
                </p>
                {isOnline && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOnline ? "Vous recevez les nouvelles missions" : "Activez pour recevoir des missions"}
              </p>
            </div>
            <Switch checked={isOnline} onCheckedChange={handleToggleOnline} disabled={isUpdating} />
          </div>
        </motion.div>

        {/* Vehicle */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Mon véhicule
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-border">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Type de véhicule</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {provider?.vehicle_type ? vehicleLabels[provider.vehicle_type] || provider.vehicle_type : "Non renseigné"}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Capacité</p>
                <p className="text-sm font-semibold text-foreground">
                  {provider?.capacity_liters
                    ? `${new Intl.NumberFormat("fr-FR").format(provider.capacity_liters)} L`
                    : "Non renseignée"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work zone */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Zone d'intervention
          </h3>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Rayon</p>
                  <p className="text-xs text-muted-foreground">Distance maximale autour de votre position</p>
                </div>
              </div>
              <span className="font-display text-2xl font-bold text-primary">{workZoneRadius}<span className="text-sm text-muted-foreground"> km</span></span>
            </div>
            <div className="mt-4 px-1">
              <Slider
                value={[workZoneRadius]}
                onValueChange={(v) => setWorkZoneRadius(v[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">1 km</span>
                <span className="text-[10px] text-muted-foreground">50 km</span>
              </div>
            </div>
            {isDirty && (
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSaveWorkZone}
                disabled={isUpdating}
                className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUpdating ? "Enregistrement..." : "Sauvegarder la zone"}
              </motion.button>
            )}
          </div>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Mon activité
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors active:bg-muted"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.accent ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.hint}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Communication & support
          </h3>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {supportItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors active:bg-muted"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-foreground" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                {item.badge && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive font-medium text-sm hover:bg-destructive/15 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Link'eco Pro • Dakar, Sénégal
        </p>
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderProfile;
