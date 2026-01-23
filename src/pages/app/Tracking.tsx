import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, Star, MapPin, Truck, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/app/Map";
import BottomNav from "@/components/app/BottomNav";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";

const serviceTypeLabels: Record<string, string> = {
  fosse_septique: "Vidange fosse septique",
  latrines: "Vidange latrines",
  urgence: "Urgence débordement",
  curage: "Curage canalisations",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-500" },
  accepted: { label: "Acceptée", color: "bg-blue-500" },
  in_progress: { label: "En route", color: "bg-primary" },
  completed: { label: "Terminée", color: "bg-green-500" },
  cancelled: { label: "Annulée", color: "bg-destructive" },
};

const Tracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrder, updateOrder, orders } = useOrders();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderId = location.state?.orderId || currentOrder?.id;
  const order = orders.find(o => o.id === orderId) || currentOrder;

  const status = order?.status || "pending";
  const statusInfo = statusLabels[status] || statusLabels.pending;

  // Show rating when order is completed
  useEffect(() => {
    if (order?.status === "completed" && !order?.rating) {
      setShowRating(true);
    }
  }, [order?.status, order?.rating]);

  const handleSubmitRating = async () => {
    if (!orderId || rating === 0) {
      toast.error("Veuillez donner une note");
      return;
    }

    setIsSubmitting(true);

    const { error } = await updateOrder(orderId, {
      rating,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la notation");
      return;
    }

    toast.success("Merci pour votre évaluation!");
    navigate("/app");
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;

    const { error } = await updateOrder(orderId, {
      status: "cancelled",
    });

    if (error) {
      toast.error("Erreur lors de l'annulation");
      return;
    }

    toast.success("Commande annulée");
    navigate("/app");
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

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
            <span className={`px-3 py-1 text-white text-sm font-medium rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Map area */}
      {order.latitude && order.longitude ? (
        <Map
          initialLat={order.latitude}
          initialLng={order.longitude}
          className="h-64"
          showTruck={status === "in_progress" || status === "accepted"}
          truckDestination={
            status === "in_progress" || status === "accepted"
              ? { lat: order.latitude, lng: order.longitude }
              : undefined
          }
        />
      ) : (
        <div className="relative h-64 bg-gradient-to-br from-secondary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-16 h-16 ${statusInfo.color} rounded-full flex items-center justify-center mx-auto mb-2 ${status === "in_progress" ? "animate-pulse" : ""}`}>
                <Truck className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">{statusInfo.label}</p>
            </div>
          </div>
        </div>
      )}

      {/* ETA indicator */}
      {(status === "accepted" || status === "in_progress") && (
        <div className="px-4 -mt-4 relative z-10">
          <div className="bg-card rounded-xl shadow-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Arrivée estimée</p>
                <p className="text-xs text-muted-foreground">Dans environ 15-25 minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waiting for provider */}
      {status === "pending" && (
        <div className="px-4 py-6">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-yellow-600 animate-spin" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Recherche d'un prestataire
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nous cherchons le meilleur prestataire disponible près de vous...
            </p>
            <Button
              variant="outline"
              className="border-destructive text-destructive"
              onClick={handleCancelOrder}
            >
              Annuler la commande
            </Button>
          </div>
        </div>
      )}

      {/* Provider info - shown when accepted */}
      {(status === "accepted" || status === "in_progress" || status === "completed") && (
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
                    {order.address}
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
                    {serviceTypeLabels[order.service_type]}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Montant</p>
                  <p className="text-xs text-muted-foreground">
                    {(order.final_price || order.price_min || 0).toLocaleString()} FCFA • {order.payment_method || "En attente"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating section */}
          {status === "completed" && !order.rating && (
            <>
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
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary text-sm resize-none h-20"
                  />
                  <Button
                    variant="hero"
                    className="w-full mt-3"
                    onClick={handleSubmitRating}
                    disabled={isSubmitting || rating === 0}
                  >
                    {isSubmitting ? "Envoi..." : "Valider"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Already rated */}
          {order.rating && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= order.rating!
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Merci pour votre évaluation!</p>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Tracking;
