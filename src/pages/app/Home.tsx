import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Home as HomeIcon, AlertTriangle, Wrench, Search } from "lucide-react";
import BottomNav from "@/components/app/BottomNav";
import ServiceCard from "@/components/app/ServiceCard";
import NotificationBell from "@/components/app/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useProfile } from "@/hooks/useProfile";
import logo from "@/assets/linkeco-logo.png";
import heroImage from "@/assets/hero-dakar.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { currentOrder } = useOrders();
  const { profile } = useProfile();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/app/auth");
    }
  }, [user, loading, navigate]);

  const services = [
    {
      icon: Droplets,
      title: "Vidange fosse septique",
      description: "Service rapide et professionnel",
      featured: true,
    },
    {
      icon: HomeIcon,
      title: "Vidange latrines",
      description: "Équipements adaptés",
      featured: false,
    },
    {
      icon: AlertTriangle,
      title: "Urgence débordement",
      description: "Intervention 24h/24",
      featured: false,
    },
    {
      icon: Wrench,
      title: "Curage canalisations",
      description: "Débouchage complet",
      featured: false,
    },
  ];

  // Get user's name from profile or user metadata
  const displayName = profile?.full_name?.split(" ")[0] || 
    user?.user_metadata?.full_name?.split(" ")[0] || 
    user?.email?.split("@")[0] || 
    "Ami";
  
  const initials = (profile?.full_name || user?.user_metadata?.full_name || user?.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card safe-area-top">
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-10" />
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <NotificationBell />
            <button 
              onClick={() => navigate("/app/profile")}
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

        {/* Greeting */}
        <div className="px-4 pb-4">
          <h1 className="font-display text-xl font-bold text-foreground">
            Bonjour, {displayName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Besoin d'un service de vidange ?
          </p>
        </div>
      </div>

      {/* Active order banner */}
      {currentOrder && currentOrder.status !== "completed" && currentOrder.status !== "cancelled" && (
        <div className="px-4 py-3">
          <button
            onClick={() => navigate("/app/tracking", { state: { orderId: currentOrder.id } })}
            className="w-full bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-lg">🚛</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Commande en cours</p>
              <p className="text-sm text-muted-foreground capitalize">
                {currentOrder.status.replace("_", " ")}
              </p>
            </div>
            <span className="text-accent font-medium">Voir →</span>
          </button>
        </div>
      )}

      {/* Hero banner */}
      <div className="px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl h-40">
          <img
            src={heroImage}
            alt="Services d'assainissement"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center p-5">
            <div>
              <h2 className="font-display text-lg font-bold text-primary-foreground mb-1">
                Commander une vidange
              </h2>
              <p className="text-sm text-primary-foreground/80 mb-3">
                Service express disponible
              </p>
              <button
                onClick={() => navigate("/app/order")}
                className="px-4 py-2 bg-primary-foreground text-primary rounded-lg text-sm font-semibold hover:bg-primary-foreground/90 transition-colors"
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="px-4">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Nos services
        </h2>
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              variant={service.featured ? "featured" : "default"}
              onClick={() => navigate("/app/order", { state: { service: service.title } })}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
