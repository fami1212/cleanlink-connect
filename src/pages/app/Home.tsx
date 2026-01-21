import { useNavigate } from "react-router-dom";
import { Droplets, Home as HomeIcon, AlertTriangle, Wrench, Bell, Search } from "lucide-react";
import BottomNav from "@/components/app/BottomNav";
import ServiceCard from "@/components/app/ServiceCard";
import logo from "@/assets/linkeco-logo.png";
import heroImage from "@/assets/hero-dakar.jpg";

const Home = () => {
  const navigate = useNavigate();

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
            <button className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">IB</span>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-4 pb-4">
          <h1 className="font-display text-xl font-bold text-foreground">
            Bonjour, Ibohima 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Besoin d'un service de vidange ?
          </p>
        </div>
      </div>

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
          {services.map((service, index) => (
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
