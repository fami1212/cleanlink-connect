import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, Star, MapPin, Truck, Clock, RefreshCw, Home, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/app/Map";
import BottomNav from "@/components/app/BottomNav";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

interface ProviderInfo {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  company_name: string | null;
  rating: number | null;
  vehicle_type: string | null;
}

const Tracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrder, updateOrder, orders, loading: ordersLoading } = useOrders();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [providerPos, setProviderPos] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<{ minutes: number; distanceKm: number } | null>(null);
  const [history, setHistory] = useState<{ lat: number; lng: number }[]>([]);
  const arrivalNotifiedRef = useRef<{ near?: boolean; arrived?: boolean }>({});
  const initialEtaRef = useRef<number | null>(null);

  const orderId = location.state?.orderId || currentOrder?.id;
  const order = orders.find(o => o.id === orderId) || currentOrder;

  const status = order?.status || "pending";
  const statusInfo = statusLabels[status] || statusLabels.pending;

  // Fetch provider info when order has a provider
  useEffect(() => {
    const fetchProviderInfo = async () => {
      if (!order?.provider_id) {
        setProviderInfo(null);
        setProviderPos(null);
        return;
      }

      // Get provider and their profile
      const { data: provider } = await supabase
        .from("providers")
        .select("user_id, company_name, rating, vehicle_type, latitude, longitude")
        .eq("id", order.provider_id)
        .single();

      if (provider) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, avatar_url")
          .eq("user_id", provider.user_id)
          .single();

        setProviderInfo({
          full_name: profile?.full_name || null,
          phone: profile?.phone || null,
          avatar_url: profile?.avatar_url || null,
          company_name: provider.company_name,
          rating: provider.rating,
          vehicle_type: provider.vehicle_type,
        });
        if (provider.latitude && provider.longitude) {
          setProviderPos({ lat: Number(provider.latitude), lng: Number(provider.longitude) });
        }
      }
    };

    fetchProviderInfo();
  }, [order?.provider_id]);

  // Realtime subscription on provider position
  useEffect(() => {
    if (!order?.provider_id) return;
    const channel = supabase
      .channel(`provider-pos-${order.provider_id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "providers", filter: `id=eq.${order.provider_id}` },
        (payload) => {
          const p: any = payload.new;
          if (p?.latitude && p?.longitude) {
            setProviderPos({ lat: Number(p.latitude), lng: Number(p.longitude) });
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [order?.provider_id]);

  // Compute ETA via OSRM when provider position changes (live mission)
  useEffect(() => {
    if (!order?.latitude || !order?.longitude || !providerPos) return;
    if (status !== "accepted" && status !== "in_progress") return;
    let cancelled = false;
    const url = `https://router.project-osrm.org/route/v1/driving/${providerPos.lng},${providerPos.lat};${order.longitude},${order.latitude}?overview=false`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const route = data?.routes?.[0];
        if (cancelled || !route) return;
        const minutes = Math.max(1, Math.round(route.duration / 60));
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        setEta({ minutes, distanceKm });
        if (initialEtaRef.current === null) initialEtaRef.current = minutes;

        const distM = distanceKm * 1000;
        if (distM <= 200 && !arrivalNotifiedRef.current.arrived) {
          arrivalNotifiedRef.current.arrived = true;
          toast.success("Votre prestataire est arrivé à proximité 🚛", { duration: 6000 });
          if (order.client_id) {
            supabase.from("notifications").insert({
              user_id: order.client_id,
              title: "Prestataire arrivé",
              message: "Le prestataire est à moins de 200 m de votre adresse.",
              type: "arrival",
              data: { order_id: order.id },
            });
          }
        } else if (distM <= 500 && !arrivalNotifiedRef.current.near) {
          arrivalNotifiedRef.current.near = true;
          toast("Votre prestataire approche (≈500 m)", { duration: 5000 });
          if (order.client_id) {
            supabase.from("notifications").insert({
              user_id: order.client_id,
              title: "Prestataire à proximité",
              message: "Le prestataire est à environ 500 m.",
              type: "approaching",
              data: { order_id: order.id },
            });
          }
        }

        if (initialEtaRef.current && minutes > initialEtaRef.current + 10 && !(arrivalNotifiedRef.current as any).delayed) {
          (arrivalNotifiedRef.current as any).delayed = true;
          toast.warning(`Retard estimé: nouvelle ETA ${minutes} min`);
          if (order.client_id) {
            supabase.from("notifications").insert({
              user_id: order.client_id,
              title: "Retard du prestataire",
              message: `Nouvelle estimation d'arrivée: ${minutes} min.`,
              type: "delay",
              data: { order_id: order.id, eta: minutes },
            });
          }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [providerPos?.lat, providerPos?.lng, order?.latitude, order?.longitude, order?.id, order?.client_id, status]);

  // Load route history (and subscribe live) for the order
  useEffect(() => {
    if (!order?.id) return;
    const fetchHistory = async () => {
      const { data } = await (supabase as any)
        .from("order_tracks")
        .select("latitude, longitude")
        .eq("order_id", order.id)
        .order("recorded_at", { ascending: true });
      if (data) setHistory(data.map((d: any) => ({ lat: Number(d.latitude), lng: Number(d.longitude) })));
    };
    fetchHistory();

    if (status === "completed" || status === "cancelled") return;
    const channel = supabase
      .channel(`order-tracks-${order.id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "order_tracks", filter: `order_id=eq.${order.id}` },
        (payload) => {
          const p: any = payload.new;
          setHistory((prev) => [...prev, { lat: Number(p.latitude), lng: Number(p.longitude) }]);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [order?.id, status]);

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

    // Update the order with rating
    const { error } = await updateOrder(orderId, {
      rating,
    });

    if (error) {
      toast.error("Erreur lors de la notation");
      setIsSubmitting(false);
      return;
    }

    // Update provider's average rating if we have a provider
    if (order?.provider_id) {
      // Get all completed orders with ratings for this provider
      const { data: ratedOrders } = await supabase
        .from("orders")
        .select("rating")
        .eq("provider_id", order.provider_id)
        .eq("status", "completed")
        .not("rating", "is", null);

      if (ratedOrders && ratedOrders.length > 0) {
        const allRatings = [...ratedOrders.map(o => o.rating!), rating];
        const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
        
        await supabase
          .from("providers")
          .update({ 
            rating: Math.round(avgRating * 10) / 10,
            total_missions: ratedOrders.length + 1
          })
          .eq("id", order.provider_id);
      }
    }

    setIsSubmitting(false);
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

  // Show loading only while fetching orders
  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  // No order found - show empty state instead of infinite loading
  if (!order) {
    return (
      <div className="min-h-screen bg-muted/30 pb-20">
        <div className="bg-card border-b border-border safe-area-top">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate("/app")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Suivi de commande
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Truck className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">
            Aucune commande en cours
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Vous n'avez pas de commande active à suivre
          </p>
          <Button variant="hero" onClick={() => navigate("/app/order")}>
            <Home className="w-4 h-4 mr-2" />
            Commander une vidange
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const providerDisplayName = providerInfo?.full_name || providerInfo?.company_name || "Prestataire";
  const providerInitials = providerDisplayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const providerRating = providerInfo?.rating || 4.5;

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
          interactive={false}
          showTruck={status === "in_progress" || status === "accepted"}
          providerLat={providerPos?.lat}
          providerLng={providerPos?.lng}
          showRoute={(status === "in_progress" || status === "accepted") && !!providerPos}
          truckDestination={
            status === "in_progress" || status === "accepted"
              ? { lat: Number(order.latitude), lng: Number(order.longitude) }
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
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden">
                {providerInfo?.avatar_url ? (
                  <img src={providerInfo.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary-foreground">{providerInitials}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">
                  {providerDisplayName}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= providerRating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-1">{providerRating.toFixed(1)}</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                Certifié
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Truck className="w-4 h-4" />
              <span>{providerInfo?.vehicle_type || "Camion citerne"}</span>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="soft" 
                className="flex-1"
                onClick={() => providerInfo?.phone && window.open(`tel:${providerInfo.phone}`, "_blank")}
                disabled={!providerInfo?.phone}
              >
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
