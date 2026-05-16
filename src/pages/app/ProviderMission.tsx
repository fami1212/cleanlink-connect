import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation, Phone, Clock, MapPin, Gauge, Navigation2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProviderOrders } from "@/hooks/useProviderOrders";
import { useGeolocation } from "@/hooks/useGeolocation";
import MissionStatusStepper from "@/components/app/MissionStatusStepper";
import Map from "@/components/app/Map";
import TrackingTimeline, { TimelineEvent } from "@/components/app/TrackingTimeline";
import { toast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types/database";

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const ProviderMission = () => {
  const navigate = useNavigate();
  const { activeOrder, updateOrderStatus, loading } = useProviderOrders();
  const { position, openNavigation, getCurrentPosition } = useGeolocation({ enableTracking: true });
  const [isUpdating, setIsUpdating] = useState(false);
  const [missionStartTime, setMissionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [eta, setEta] = useState<{ minutes: number; distanceKm: number; source: "osrm" | "estimated" } | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const lastEtaBucketRef = useRef<number | null>(null);
  const lastStatusRef = useRef<string | null>(null);
  const lastPosRef = useRef<{ lat: number; lng: number; at: number } | null>(null);

  const pushEvent = (ev: Omit<TimelineEvent, "id" | "at"> & { at?: Date }) => {
    setEvents((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: ev.at ?? new Date(), ...ev },
    ]);
  };

  // Status changes → timeline
  useEffect(() => {
    if (!activeOrder?.status) return;
    if (lastStatusRef.current === activeOrder.status) return;
    lastStatusRef.current = activeOrder.status;
    const s = activeOrder.status;
    if (s === "accepted") pushEvent({ type: "start", label: "Mission acceptée", detail: "En route vers le client" });
    else if (s === "in_progress") pushEvent({ type: "status", label: "Intervention démarrée", detail: "Sur place" });
    else if (s === "completed") pushEvent({ type: "arrived", label: "Mission terminée" });
  }, [activeOrder?.status]);

  // ETA computation with OSRM + fallback
  useEffect(() => {
    if (!activeOrder?.latitude || !activeOrder?.longitude || !position) return;
    if (activeOrder.status !== "accepted" && activeOrder.status !== "in_progress") return;
    let cancelled = false;
    const dest = { lat: Number(activeOrder.latitude), lng: Number(activeOrder.longitude) };
    const me = { lat: position.latitude, lng: position.longitude };

    const applyEta = (minutes: number, distanceKm: number, source: "osrm" | "estimated") => {
      if (cancelled) return;
      setEta({ minutes, distanceKm, source });
      const bucket = Math.round(minutes / 5) * 5;
      if (lastEtaBucketRef.current === null) {
        lastEtaBucketRef.current = bucket;
        pushEvent({ type: "eta", label: `ETA initiale: ${minutes} min`, detail: `${distanceKm} km` });
      } else if (bucket !== lastEtaBucketRef.current) {
        lastEtaBucketRef.current = bucket;
        pushEvent({
          type: "eta",
          label: `ETA: ${minutes} min`,
          detail: `${distanceKm} km${source === "estimated" ? " (estimation)" : ""}`,
        });
      }
    };

    const fallback = () => {
      const distanceKm = Math.round(haversineKm(me, dest) * 10) / 10;
      let speedKmh = 25;
      if (lastPosRef.current) {
        const dKm = haversineKm(lastPosRef.current, me);
        const dH = (Date.now() - lastPosRef.current.at) / 3600000;
        if (dH > 0 && dKm > 0.01) speedKmh = Math.min(80, Math.max(5, dKm / dH));
      }
      const minutes = Math.max(1, Math.round((distanceKm / speedKmh) * 60));
      applyEta(minutes, distanceKm, "estimated");
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `https://router.project-osrm.org/route/v1/driving/${me.lng},${me.lat};${dest.lng},${dest.lat}?overview=false`;
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        clearTimeout(timeout);
        const route = data?.routes?.[0];
        if (cancelled) return;
        if (!route) return fallback();
        const minutes = Math.max(1, Math.round(route.duration / 60));
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        applyEta(minutes, distanceKm, "osrm");
      })
      .catch(() => {
        clearTimeout(timeout);
        if (!cancelled) fallback();
      });

    lastPosRef.current = { lat: me.lat, lng: me.lng, at: Date.now() };
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [position?.latitude, position?.longitude, activeOrder?.latitude, activeOrder?.longitude, activeOrder?.status]);


  useEffect(() => {
    if (!loading && !activeOrder) {
      navigate("/app/provider");
    }
  }, [activeOrder, loading, navigate]);

  useEffect(() => {
    if (activeOrder?.accepted_at) {
      setMissionStartTime(new Date(activeOrder.accepted_at));
    }
  }, [activeOrder?.accepted_at]);

  useEffect(() => {
    if (!missionStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - missionStartTime.getTime()) / 1000);
      setElapsedTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [missionStartTime]);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins.toString().padStart(2, "0")}m`;
    }
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!activeOrder) return;

    setIsUpdating(true);
    const { error } = await updateOrderStatus(activeOrder.id, newStatus);
    setIsUpdating(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } else if (newStatus === "completed") {
      toast({
        title: "Mission terminée! 🎉",
        description: "Félicitations pour cette mission réussie",
      });
      navigate("/app/provider");
    } else {
      toast({
        title: "Statut mis à jour",
        description: "La mission progresse",
      });
    }
  };

  const handleNavigate = () => {
    if (activeOrder?.latitude && activeOrder?.longitude) {
      openNavigation(activeOrder.latitude, activeOrder.longitude, "google");
    }
  };

  if (loading || !activeOrder) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const serviceLabels: Record<string, string> = {
    fosse_septique: "Vidange fosse septique",
    latrines: "Vidange latrines",
    urgence: "Intervention urgente",
    curage: "Curage canalisation",
  };

  const estimatedPrice = activeOrder.price_min && activeOrder.price_max
    ? `${new Intl.NumberFormat("fr-FR").format((activeOrder.price_min + activeOrder.price_max) / 2)} FCFA`
    : activeOrder.final_price
    ? `${new Intl.NumberFormat("fr-FR").format(activeOrder.final_price)} FCFA`
    : "25 000 FCFA";

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="bg-card safe-area-top sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/app/provider")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-semibold text-foreground">
              Mission en cours
            </h1>
            <p className="text-sm text-muted-foreground">
              {serviceLabels[activeOrder.service_type]}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{formatElapsedTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <Map
          interactive={false}
          className="h-56"
          initialLat={activeOrder.latitude || 14.6937}
          initialLng={activeOrder.longitude || -17.4441}
          providerLat={position?.latitude}
          providerLng={position?.longitude}
          showRoute
        />
        
        {/* Navigation overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="shadow-lg"
            onClick={() => window.open(`tel:+221000000000`, "_blank")}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="hero"
            className="shadow-lg"
            onClick={handleNavigate}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Naviguer
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 pb-24">
        {/* Client info */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h2 className="font-display font-semibold text-foreground mb-3">
            Informations client
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium text-foreground">{activeOrder.address}</p>
              </div>
            </div>
            {activeOrder.notes && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm text-foreground">{activeOrder.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Earnings estimate */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gain estimé</p>
              <p className="font-display text-2xl font-bold text-primary">
                {estimatedPrice}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Mission status stepper */}
        <MissionStatusStepper
          currentStatus={activeOrder.status}
          onStatusChange={handleStatusChange}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
};

export default ProviderMission;
