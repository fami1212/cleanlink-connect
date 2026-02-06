import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, CreditCard, FileText, HelpCircle, LogOut, ChevronRight, Settings, RefreshCw, Heart, Shield } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/app/BottomNav";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useOrders } from "@/hooks/useOrders";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { roles, addRole } = useUserRole();
  const { orders } = useOrders();
  const { unreadCount } = useNotifications();
  const [isTogglingProvider, setIsTogglingProvider] = useState(false);

  const isProvider = roles.includes("provider");
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const averageRating = orders.filter(o => o.rating).reduce((acc, o) => acc + (o.rating || 0), 0) / 
    (orders.filter(o => o.rating).length || 1);

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

  const menuItems = [
    { icon: User, label: "Informations personnelles", path: "/app/profile/edit", badge: null, color: "primary" },
    { icon: FileText, label: "Historique des commandes", path: "/app/profile/history", badge: null, color: "secondary" },
    { icon: CreditCard, label: "Moyens de paiement", path: "/app/profile/payments", badge: null, color: "accent" },
    { icon: Heart, label: "Favoris", path: "/app/favorites", badge: null, color: "primary" },
    { icon: Bell, label: "Notifications", path: "/app/notifications", badge: unreadCount > 0 ? unreadCount : null, color: "secondary" },
    { icon: HelpCircle, label: "Aide et support", path: "/app/help", badge: null, color: "accent" },
    { icon: Settings, label: "Paramètres", path: "/app/settings", badge: null, color: "primary" },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    navigate("/app/auth");
    return null;
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur";
  const phone = profile?.phone || user.phone || "+221 XX XXX XX XX";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-24">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-br from-primary via-linkeco-green-light to-accent safe-area-top relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="p-6 pt-8 text-center relative z-10">
          <motion.div 
            className="relative inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl overflow-hidden ring-4 ring-white/20">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">{initials}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="font-display text-2xl font-bold text-primary-foreground mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {displayName}
          </motion.h1>
          <motion.p 
            className="text-sm text-primary-foreground/80 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {phone}
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                <p className="font-display font-bold text-xl text-primary-foreground">
                  {completedOrders}
                </p>
              </div>
              <p className="text-xs text-primary-foreground/70">Commandes</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                <p className="font-display font-bold text-xl text-primary-foreground">
                  {averageRating.toFixed(1)}
                </p>
              </div>
              <p className="text-xs text-primary-foreground/70">Note moyenne</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 -mt-4 relative z-10">
        {/* Provider toggle */}
        <motion.div 
          className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-lg">🚛</span>
              </div>
              <h3 className="font-display font-semibold text-foreground">
                {isProvider ? "Accéder au dashboard" : "Devenir prestataire"}
              </h3>
            </div>
            <Switch 
              checked={isProvider}
              onCheckedChange={handleToggleProvider}
              disabled={isTogglingProvider}
            />
          </div>
          <p className="text-sm text-muted-foreground pl-13">
            {isProvider 
              ? "Basculez vers le dashboard prestataire"
              : "Activez pour recevoir des missions et gagner de l'argent"
            }
          </p>
        </motion.div>

        {/* Menu */}
        <motion.div 
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                item.color === "primary" ? "bg-primary/10" :
                item.color === "secondary" ? "bg-secondary/10" : "bg-accent/10"
              }`}>
                <item.icon className={`w-5 h-5 ${
                  item.color === "primary" ? "text-primary" :
                  item.color === "secondary" ? "text-secondary" : "text-accent"
                }`} />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                {item.label}
              </span>
              {item.badge && (
                <span className="w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 mt-4 bg-destructive/10 rounded-2xl hover:bg-destructive/20 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-11 h-11 bg-destructive/20 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="flex-1 text-left font-medium text-destructive">
            Se déconnecter
          </span>
        </motion.button>

        {/* Version */}
        <motion.p 
          className="text-center text-xs text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Link'eco v1.0.0 • Dakar, Sénégal
        </motion.p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
