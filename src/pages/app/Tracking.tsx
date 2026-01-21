import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, Star, MapPin, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/app/BottomNav";

const Tracking = () => {
  const navigate = useNavigate();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/app")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Suivi en temps réel
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              En route
            </span>
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="relative h-64 bg-gradient-to-br from-secondary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Truck className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Camion en approche</p>
            <p className="text-xs text-muted-foreground">Distance: 2.5 km</p>
          </div>
        </div>
        
        {/* Route indicator */}
        <div className="absolute bottom-4 left-4 right-4 bg-card rounded-xl shadow-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">Arrivée estimée</p>
              <p className="text-xs text-muted-foreground">Dans environ 15 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider info */}
      <div className="p-4 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">BC</span>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">
                Boubacar Camara
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">4.8</span>
              </div>
            </div>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Certifié
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Truck className="w-4 h-4" />
            <span>Camion 8m³ • Immatriculation: DK-1234-AB</span>
          </div>

          <div className="flex gap-3">
            <Button variant="soft" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
            <Button variant="softBlue" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>

        {/* Order details */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-display font-semibold text-foreground mb-3">
            Détails de l'intervention
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Adresse</p>
                <p className="text-xs text-muted-foreground">
                  Rue Meya, Médina, Dakar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm">💧</span>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Service</p>
                <p className="text-xs text-muted-foreground">
                  Vidange fosse septique
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Montant</p>
                <p className="text-xs text-muted-foreground">25 000 FCFA • Payé</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating section (appears after service) */}
        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          onClick={() => setShowRating(true)}
        >
          <Star className="w-4 h-4 mr-2" />
          Noter le prestataire
        </Button>

        {showRating && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-display font-semibold text-foreground mb-3 text-center">
              Évaluez l'intervention
            </h3>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Laissez un commentaire (optionnel)"
              className="w-full p-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary text-sm resize-none h-20"
            />
            <Button
              variant="hero"
              className="w-full mt-3"
              onClick={() => navigate("/app")}
            >
              Valider
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Tracking;
