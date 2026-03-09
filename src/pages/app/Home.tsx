import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Home as HomeIcon, AlertTriangle, Wrench, ArrowRight, Navigation, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/app/BottomNav";
import ServiceCard from "@/components/app/ServiceCard";
import NotificationBell from "@/components/app/NotificationBell";
import Map from "@/components/app/Map";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useProviders, Provider } from "@/hooks/useProviders";
import logo from "@/assets/linkeco-logo.png";
import L from "leaflet";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { currentOrder } = useOrders();
  const { profile } = useProfile();
  const { roles } = useUserRole();
  const { providers } = useProviders();
  const [userLat, setUserLat] = useState(14.6937);
  const [userLng, setUserLng] = useState(-17.4441);
  const [userAddress, setUserAddress] = useState("");
  const [locating, setLocating] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const isProvider = roles.includes("provider");

  useEffect(() => {
    if (!loading && !user) navigate("/app/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
            const data = await res.json();
            setUserAddress(data.display_name?.split(",").slice(0, 3).join(",") || "Votre position");
          } catch { setUserAddress("Votre position"); }
          setLocating(false);
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocating(false);
    }
  }, []);

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

  const providersWithLocation = providers.filter(p => p.latitude && p.longitude);

  const handleBookProvider = (provider: Provider) => {
    navigate("/app/order", { state: { preferredProviderId: provider.id } });
  };

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
      <div className="bg-card safe-area-top border-b border-border sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-9" />
          <div className="flex items-center gap-2">
            {isProvider && (
              <button
                onClick={() => navigate("/app/provider")}
                className="px-3 py-1.5 rounded-lg bg-accent/15 text-accent text-xs font-semibold hover:bg-accent/25 transition-colors"
              >
                🚛 Mode prestataire
              </button>
            )}
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
      <div className="px-4 pt-6 pb-3 relative z-0">
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

      {/* User location map */}
      <motion.div
        className="px-4 pb-4 relative z-0"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
          <Map
            initialLat={userLat}
            initialLng={userLng}
            interactive={false}
            className="h-40"
          />
          <div className="bg-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Navigation className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Votre position</p>
              <p className="text-sm font-medium text-foreground truncate">
                {locating ? "Localisation en cours..." : userAddress || "Dakar, Sénégal"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Providers nearby map */}
      {providersWithLocation.length > 0 && (
        <motion.div
          className="px-4 pb-4 relative z-0"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-display font-bold text-foreground text-sm mb-2 px-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Prestataires à proximité ({providersWithLocation.length})
          </h3>
          <ProvidersMap
            providers={providersWithLocation}
            onSelectProvider={setSelectedProvider}
          />
          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {(selectedProvider.company_name || "P").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{selectedProvider.company_name || "Prestataire"}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-muted-foreground">{Number(selectedProvider.rating || 0).toFixed(1)} • {selectedProvider.total_missions || 0} missions</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBookProvider(selectedProvider)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Réserver
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Active order */}
      {currentOrder && currentOrder.status !== "completed" && currentOrder.status !== "cancelled" && (
        <motion.div className="px-4 pb-4 relative z-0" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
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
        className="px-4 pb-6 relative z-0"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
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
      <div className="px-4 relative z-0">
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

// Providers Map component
const ProvidersMap = ({
  providers,
  onSelectProvider,
}: {
  providers: Provider[];
  onSelectProvider: (p: Provider) => void;
}) => {
  const containerRef = useEffect;

  useEffect(() => {
    const container = document.getElementById("providers-map-home");
    if (!container) return;

    const map = L.map(container, {
      center: [14.6937, -17.4441],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const bounds: [number, number][] = [];

    providers.forEach((p) => {
      if (!p.latitude || !p.longitude) return;
      bounds.push([p.latitude, p.longitude]);

      const icon = L.divIcon({
        html: `<div style="background: hsl(var(--primary)); color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer;">🚛</div>`,
        className: "custom-provider-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([p.latitude, p.longitude], { icon })
        .addTo(map)
        .on("click", () => onSelectProvider(p));
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }

    return () => { map.remove(); };
  }, [providers, onSelectProvider]);

  return (
    <div
      id="providers-map-home"
      className="w-full h-48 rounded-2xl overflow-hidden border border-border"
    />
  );
};

export default Home;
