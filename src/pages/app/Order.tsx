import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialService = location.state?.service || "Vidange fosse septique";
  
  const [selectedService, setSelectedService] = useState(initialService);
  const [address, setAddress] = useState("");
  const [showServiceSelect, setShowServiceSelect] = useState(false);

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

      {/* Map placeholder */}
      <div className="relative h-48 bg-muted">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Carte interactive</p>
          </div>
        </div>
        
        {/* Location input overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-card rounded-xl shadow-lg p-3 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Entrez votre adresse..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
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

        {/* Location info */}
        <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
          <MapPin className="w-5 h-5 text-accent" />
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {address || "Sélectionnez une adresse"}
            </p>
            <p className="text-sm text-muted-foreground">Dakar, Sénégal</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-card border-t border-border safe-area-bottom">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={() => navigate("/app/payment")}
        >
          Commander
        </Button>
      </div>
    </div>
  );
};

export default Order;
