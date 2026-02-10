import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, CreditCard, FileText, HelpCircle, LogOut, ChevronRight, Settings, Heart } from "lucide-react";
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
      if (error) { toast.error("Erreur lors de l'activation"); return; }
      toast.success("Mode prestataire activé!");
      navigate("/app/provider");
    } else if (checked && isProvider) {
      navigate("/app/provider");
    }
  };

  const menuItems = [
    { icon: User, label: "Informations personnelles", path: "/app/profile/edit" },
    { icon: FileText, label: "Historique des commandes", path: "/app/profile/history" },
    { icon: CreditCard, label: "Moyens de paiement", path: "/app/profile/payments" },
    { icon: Heart, label: "Favoris", path: "/app/favorites" },
    { icon: Bell, label: "Notifications", path: "/app/notifications", badge: unreadCount > 0 ? unreadCount : null },
    { icon: HelpCircle, label: "Aide et support", path: "/app/help" },
    { icon: Settings, label: "Paramètres", path: "/app/settings" },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  if (!user) { navigate("/app/auth"); return null; }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur";
  const phone = profile?.phone || user.phone || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile header */}
      <div className="bg-primary safe-area-top">
        <div className="px-6 pt-10 pb-8 text-center">
          <motion.div
            className="w-20 h-20 rounded-2xl bg-white mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary">{initials}</span>
            )}
          </motion.div>
          <h1 className="font-display text-xl font-bold text-primary-foreground mb-1">{displayName}</h1>
          {phone && <p className="text-sm text-primary-foreground/60">{phone}</p>}
          <div className="flex justify-center gap-6 mt-5">
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-primary-foreground">{completedOrders}</p>
              <p className="text-xs text-primary-foreground/50">Commandes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 -mt-3 relative z-10">
        {/* Provider toggle */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <span className="text-lg">🚛</span>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">
                  {isProvider ? "Dashboard prestataire" : "Devenir prestataire"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isProvider ? "Accédez à vos missions" : "Gagnez de l'argent"}
                </p>
              </div>
            </div>
            <Switch checked={isProvider} onCheckedChange={handleToggleProvider} disabled={isTogglingProvider} />
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div
          className="bg-card border border-border rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-4.5 h-4.5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/8 rounded-2xl text-destructive font-medium text-sm hover:bg-destructive/15 transition-colors"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </motion.button>

        <p className="text-center text-xs text-muted-foreground pt-4">
          Link'eco v1.0.0 • Dakar, Sénégal
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
