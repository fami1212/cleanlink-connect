import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Home as HomeIcon, AlertTriangle, Wrench, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/app/BottomNav";
import ServiceCard from "@/components/app/ServiceCard";
import NotificationBell from "@/components/app/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useProfile } from "@/hooks/useProfile";
import logo from "@/assets/linkeco-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { currentOrder } = useOrders();
  const { profile } = useProfile();

  useEffect(() => {
    if (!loading && !user) navigate("/app/auth");
  }, [user, loading, navigate]);

  const services = [
    { icon: Droplets, title: "Vidange fosse septique", description: "Service rapide et professionnel", featured: true },
    { icon: HomeIcon, title: "Vidange latrines", description: "Équipements adaptés", featured: false },
    { icon: AlertTriangle, title: "Urgence débordement", description: "Intervention 24h/24", featured: false },
    { icon: Wrench, title: "Curage canalisations", description: "Débouchage complet", featured: false },
  ];

  const displayName = profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] || "Ami";

  const initials = (profile?.full_name || user?.user_metadata?.full_name || user?.email || "U")
    .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card safe-area-top border-b border-border">
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-9" />
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              onClick={() => navigate("/app/profile")}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary-foreground">{initials}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-4 pt-6 pb-4">
        <motion.p className="text-sm text-muted-foreground mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Bonjour 👋
        </motion.p>
        <motion.h1
          className="font-display text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {displayName}
        </motion.h1>
      </div>

      {/* Active order */}
      {currentOrder && currentOrder.status !== "completed" && currentOrder.status !== "cancelled" && (
        <motion.div className="px-4 pb-4" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <button
            onClick={() => navigate("/app/tracking", { state: { orderId: currentOrder.id } })}
            className="w-full bg-primary rounded-2xl p-4 flex items-center gap-4 shadow-green"
          >
            <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
              <span className="text-lg">🚛</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-primary-foreground text-sm">Commande en cours</p>
              <p className="text-xs text-primary-foreground/70 capitalize">{currentOrder.status.replace("_", " ")}</p>
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/80 text-sm font-medium">
              Suivre <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </motion.div>
      )}

      {/* Quick action */}
      <motion.div
        className="px-4 pb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => navigate("/app/order")}
          className="w-full bg-accent/10 border border-accent/20 rounded-2xl p-5 text-left hover:bg-accent/15 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-foreground text-lg mb-1">Commander une vidange</p>
              <p className="text-sm text-muted-foreground">Prestataires disponibles maintenant</p>
            </div>
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-gold">
              <ArrowRight className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
        </button>
      </motion.div>

      {/* Services */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">Nos services</h2>
        </div>
        <div className="space-y-2.5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                variant={service.featured ? "featured" : "default"}
                onClick={() => navigate("/app/order", { state: { service: service.title } })}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
