import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Home as HomeIcon, AlertTriangle, Wrench, Search, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
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
        <motion.div 
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-24">
      {/* Header */}
      <motion.div 
        className="bg-card safe-area-top shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-10" />
          <div className="flex items-center gap-3">
            <motion.button 
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <NotificationBell />
            <motion.button 
              onClick={() => navigate("/app/profile")}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary-foreground">{initials}</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-4 pb-5">
          <motion.h1 
            className="font-display text-2xl font-bold text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Bonjour, {displayName} 👋
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Besoin d'un service de vidange ?
          </motion.p>
        </div>
      </motion.div>

      {/* Active order banner */}
      {currentOrder && currentOrder.status !== "completed" && currentOrder.status !== "cancelled" && (
        <motion.div 
          className="px-4 py-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => navigate("/app/tracking", { state: { orderId: currentOrder.id } })}
            className="w-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xl">🚛</span>
            </motion.div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Commande en cours</p>
              <p className="text-sm text-muted-foreground capitalize">
                {currentOrder.status.replace("_", " ")}
              </p>
            </div>
            <div className="flex items-center gap-1 text-accent font-medium">
              <span>Suivre</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Hero banner */}
      <motion.div 
        className="px-4 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="relative overflow-hidden rounded-3xl h-44 shadow-xl"
          whileHover={{ scale: 1.01 }}
        >
          <img
            src={heroImage}
            alt="Services d'assainissement"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent flex items-center p-6">
            <div>
              <motion.div 
                className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-medium text-white">Service express</span>
              </motion.div>
              <h2 className="font-display text-xl font-bold text-primary-foreground mb-2">
                Commander une vidange
              </h2>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Prestataires disponibles maintenant
              </p>
              <motion.button
                onClick={() => navigate("/app/order")}
                className="px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Commander
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Services */}
      <motion.div 
        className="px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Nos services
          </h2>
          <button className="text-sm text-primary font-medium">Voir tout</button>
        </div>
        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
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
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Home;
