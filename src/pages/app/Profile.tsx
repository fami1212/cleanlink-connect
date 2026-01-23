import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bell, CreditCard, FileText, HelpCircle, LogOut, ChevronRight, Settings, RefreshCw } from "lucide-react";
import BottomNav from "@/components/app/BottomNav";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { roles, addRole } = useUserRole();
  const { orders } = useOrders();
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
    { icon: User, label: "Informations personnelles", path: "/app/profile/edit" },
    { icon: FileText, label: "Historique des commandes", path: "/app/profile/history" },
    { icon: CreditCard, label: "Moyens de paiement", path: "/app/profile/payments" },
    { icon: Bell, label: "Notifications", path: "/app/profile/notifications" },
    { icon: HelpCircle, label: "Aide et support", path: "/app/help" },
    { icon: Settings, label: "Paramètres", path: "/app/settings" },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
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
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-linkeco-green-light safe-area-top">
        <div className="p-6 pt-8 text-center">
          <div className="w-20 h-20 bg-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={displayName} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">{initials}</span>
            )}
          </div>
          <h1 className="font-display text-xl font-bold text-primary-foreground">
            {displayName}
          </h1>
          <p className="text-sm text-primary-foreground/80">
            {phone}
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="font-display font-bold text-lg text-primary-foreground">
                {completedOrders}
              </p>
              <p className="text-xs text-primary-foreground/70">Commandes</p>
            </div>
            <div className="w-px bg-primary-foreground/20" />
            <div className="text-center">
              <p className="font-display font-bold text-lg text-primary-foreground">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-primary-foreground/70">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-4">
        {/* Provider toggle */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">
              {isProvider ? "Accéder au dashboard" : "Devenir prestataire"}
            </h3>
            <Switch 
              checked={isProvider}
              onCheckedChange={handleToggleProvider}
              disabled={isTogglingProvider}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {isProvider 
              ? "Basculez vers le dashboard prestataire"
              : "Activez pour recevoir des missions et gagner de l'argent"
            }
          </p>
        </div>

        {/* Menu */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => toast.info("Fonctionnalité à venir")}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 mt-4 bg-destructive/10 rounded-xl hover:bg-destructive/20 transition-colors"
        >
          <div className="w-10 h-10 bg-destructive/20 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="flex-1 text-left font-medium text-destructive">
            Se déconnecter
          </span>
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Link'eco v1.0.0 • Dakar, Sénégal
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
