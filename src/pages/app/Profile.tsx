import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Heart,
  MapPin,
  Truck,
  MessageSquare,
  Camera,
  Loader2,
  Shield,
  Star,
  ShoppingBag,
  Wallet,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/app/BottomNav";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useOrders } from "@/hooks/useOrders";
import { useNotifications } from "@/hooks/useNotifications";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useFavorites } from "@/hooks/useFavorites";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { toast } from "sonner";

const formatFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " F";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { roles, addRole } = useUserRole();
  const { orders } = useOrders();
  const { unreadCount } = useNotifications();
  const { unreadCount: unreadMessages } = useUnreadMessages();
  const { favorites } = useFavorites();
  const { uploadAvatar, uploading: avatarUploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTogglingProvider, setIsTogglingProvider] = useState(false);

  const isProvider = roles.includes("provider");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalSpent = completedOrders.reduce(
    (s, o) => s + (o.final_price || o.price_min || 0),
    0
  );

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/app/auth");
  };

  const handleToggleProvider = async (checked: boolean) => {
    if (checked && !isProvider) {
      setIsTogglingProvider(true);
      const { error } = await addRole("provider");
      setIsTogglingProvider(false);
      if (error) {
        toast.error("Erreur lors de l'activation");
        return;
      }
      toast.success("Mode prestataire activé!");
      navigate("/app/provider");
    } else if (checked && isProvider) {
      navigate("/app/provider");
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop volumineuse (max 5 Mo)");
      return;
    }
    const { url, error } = await uploadAvatar(file);
    if (error) {
      toast.error("Erreur lors de l'envoi");
      return;
    }
    if (url) {
      await updateProfile({ avatar_url: url });
      toast.success("Photo de profil mise à jour");
    }
  };

  if (authLoading || profileLoading) {
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

  if (!user) {
    navigate("/app/auth");
    return null;
  }

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Utilisateur";
  const phone = profile?.phone || user.phone || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const quickActions = [
    { icon: Truck, label: "Commander", to: "/app/order", color: "text-primary", bg: "bg-primary/10" },
    { icon: MapPin, label: "Suivi", to: "/app/tracking", color: "text-accent", bg: "bg-accent/10" },
    {
      icon: MessageSquare,
      label: "Messages",
      to: "/app/conversations",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    { icon: Heart, label: "Favoris", to: "/app/favorites", color: "text-rose-600", bg: "bg-rose-500/10" },
  ];

  const accountItems = [
    { icon: User, label: "Informations personnelles", path: "/app/profile/edit", hint: "Nom, téléphone, adresse" },
    { icon: FileText, label: "Historique des commandes", path: "/app/profile/history", hint: `${orders.length} commande${orders.length > 1 ? "s" : ""}` },
    { icon: CreditCard, label: "Moyens de paiement", path: "/app/profile/payments", hint: "Wave, Orange Money, espèces" },
  ];

  const preferencesItems = [
    {
      icon: Bell,
      label: "Notifications",
      path: "/app/notifications",
      hint: "Alertes & préférences de suivi",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { icon: Settings, label: "Paramètres", path: "/app/settings", hint: "Langue, apparence, sécurité" },
    { icon: HelpCircle, label: "Aide et support", path: "/app/help", hint: "FAQ & contact" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Premium emerald-prestige header */}
      <div className="relative bg-gradient-hero-dark safe-area-top overflow-hidden noise">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-12 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl" />

        <div className="relative px-5 pt-8 pb-20">
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent font-semibold mb-4">Mon espace</p>
          <div className="flex items-start gap-4">
            <div className="relative">
              <motion.button
                onClick={handleAvatarClick}
                disabled={avatarUploading}
                className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-float ring-2 ring-accent/40"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {avatarUploading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-2xl font-bold text-primary">{initials}</span>
                )}
              </motion.button>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
                <Camera className="w-3.5 h-3.5 text-accent-foreground" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h1 className="font-display text-2xl font-bold text-white truncate tracking-tight">{displayName}</h1>
              {phone && <p className="text-sm text-white/60 truncate font-light">{phone}</p>}
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white glass-dark px-2.5 py-1 rounded-full">
                  <Shield className="w-3 h-3 text-accent" /> Vérifié
                </span>
                {isProvider && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground bg-gradient-gold px-2.5 py-1 rounded-full shadow-gold">
                    <Sparkles className="w-3 h-3" /> Pro
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats card overlay */}
        <div className="absolute left-4 right-4 -bottom-8 z-10">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border rounded-2xl shadow-xl grid grid-cols-3 divide-x divide-border overflow-hidden"
          >
            <div className="p-3 text-center">
              <ShoppingBag className="w-4 h-4 text-primary mx-auto mb-1" />
              <p className="font-display text-lg font-bold text-foreground leading-none">{completedOrders.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Commandes</p>
            </div>
            <div className="p-3 text-center">
              <Wallet className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="font-display text-base font-bold text-foreground leading-none truncate">
                {totalSpent > 0 ? formatFCFA(totalSpent) : "0 F"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Total dépensé</p>
            </div>
            <div className="p-3 text-center">
              <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
              <p className="font-display text-lg font-bold text-foreground leading-none">{favorites.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Favoris</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spacer for overlay card */}
      <div className="h-10" />

      <div className="p-4 space-y-5">
        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.to)}
              className="relative bg-card border border-border rounded-2xl py-3 flex flex-col items-center gap-1.5 hover:shadow-md transition-all active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                <a.icon className={`w-5 h-5 ${a.color}`} />
              </div>
              <span className="text-[11px] font-medium text-foreground">{a.label}</span>
              {a.badge && (
                <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {a.badge > 9 ? "9+" : a.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Provider toggle */}
        <motion.div
          className={`rounded-2xl p-4 border transition-all ${
            isProvider
              ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30"
              : "bg-card border-border"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-sm">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-foreground text-sm">
                {isProvider ? "Espace prestataire" : "Devenir prestataire"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isProvider
                  ? "Accédez à votre dashboard et vos missions"
                  : "Inscrivez-vous et gagnez des revenus"}
              </p>
            </div>
            {isProvider ? (
              <button
                onClick={() => navigate("/app/provider")}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
              >
                Ouvrir
              </button>
            ) : (
              <Switch checked={false} onCheckedChange={handleToggleProvider} disabled={isTogglingProvider} />
            )}
          </div>
        </motion.div>

        {/* Account section */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Mon compte
          </h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {accountItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left active:bg-muted"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
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

        {/* Preferences */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Préférences
          </h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {preferencesItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left active:bg-muted"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.hint}</p>
                </div>
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

        {/* Member since + rate badge */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Membre Link'eco</p>
            <p className="text-xs text-muted-foreground">Depuis {memberSince}</p>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive font-medium text-sm hover:bg-destructive/15 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </motion.button>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Link'eco v1.0.0 • Dakar, Sénégal
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
