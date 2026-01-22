import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/app/Map";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";
import { ServiceType } from "@/types/database";

const serviceTypeMap: Record<string, ServiceType> = {
  "Vidange fosse septique": "fosse_septique",
  "Vidange latrines": "latrines",
  "Urgence débordement": "urgence",
  "Curage canalisations": "curage",
};

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  
  const initialService = location.state?.service || "Vidange fosse septique";
  
  const [selectedService, setSelectedService] = useState(initialService);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showServiceSelect, setShowServiceSelect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    "Vidange fosse septique",
    "Vidange latrines",
    "Urgence débordement",
    "Curage canalisations",
  ];

  const priceRange = {
    "Vidange fosse septique": { min: 25000, max: 30000 },
    "Vidange latrines": { min: 15000, max: 20000 },
    "Urgence débordement": { min: 35000, max: 50000 },
    "Curage canalisations": { min: 20000, max: 30000 },
  };

  const currentPrice = priceRange[selectedService as keyof typeof priceRange] || { min: 25000, max: 30000 };

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(addr.split(",").slice(0, 3).join(","));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      navigate("/app/auth");
      return;
    }

    if (!address || !latitude || !longitude) {
      toast.error("Veuillez sélectionner une adresse sur la carte");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createOrder({
      service_type: serviceTypeMap[selectedService],
      address,
      latitude,
      longitude,
      price_min: currentPrice.min,
      price_max: currentPrice.max,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la création de la commande");
      console.error(error);
      return;
    }

    toast.success("Commande créée!");
    navigate("/app/payment", { state: { orderId: data?.id, price: currentPrice } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Commander
          </h1>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLat={14.6937}
          initialLng={-17.4441}
          className="h-56"
          interactive={true}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Address display */}
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-sm text-muted-foreground mb-1">Adresse sélectionnée</p>
          <p className="font-medium text-foreground">
            {address || "Cliquez sur la carte ou utilisez la géolocalisation"}
          </p>
        </div>

        {/* Service selector */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Type de service
          </label>
          <button
            onClick={() => setShowServiceSelect(!showServiceSelect)}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl"
          >
            <span className="font-medium text-foreground">{selectedService}</span>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showServiceSelect ? "rotate-180" : ""}`} />
          </button>
          
          {showServiceSelect && (
            <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => {
                    setSelectedService(service);
                    setShowServiceSelect(false);
                  }}
                  className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                    selectedService === service ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price estimate */}
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Prix estimé</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-xs">⭐</span>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-primary">
              {currentPrice.min.toLocaleString()} ~ {currentPrice.max.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">FCFA</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-card border-t border-border safe-area-bottom">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || !address}
        >
          {isSubmitting ? "Création..." : "Commander"}
        </Button>
      </div>
    </div>
  );
};

export default Order;
