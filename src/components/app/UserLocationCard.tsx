import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface UserLocationCardProps {
  lat: number;
  lng: number;
  address: string;
  locating?: boolean;
  accuracy?: number; // meters
  onRecenter?: () => void;
}

const UserLocationCard = ({
  lat,
  lng,
  address,
  locating,
  accuracy,
  onRecenter,
}: UserLocationCardProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const accuracyCircle = useRef<L.Circle | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date>(new Date());

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      { maxZoom: 19 }
    ).addTo(map);

    const icon = L.divIcon({
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:48px;height:48px;border-radius:50%;background:hsl(var(--primary)/0.20);animation:pulse-ring 2s ease-out infinite;"></div>
          <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:hsl(var(--primary)/0.35);"></div>
          <div style="position:relative;width:14px;height:14px;border-radius:50%;background:hsl(var(--primary));border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
        </div>`,
      className: "user-gps-marker",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    userMarker.current = L.marker([lat, lng], { icon, interactive: false }).addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      userMarker.current = null;
      accuracyCircle.current = null;
    };
  }, []);

  // Update on coord change
  useEffect(() => {
    if (!mapInstance.current || !userMarker.current) return;
    userMarker.current.setLatLng([lat, lng]);
    mapInstance.current.setView([lat, lng], mapInstance.current.getZoom(), { animate: true });
    setUpdatedAt(new Date());

    if (accuracy && accuracy > 0) {
      if (accuracyCircle.current) {
        accuracyCircle.current.setLatLng([lat, lng]).setRadius(accuracy);
      } else {
        accuracyCircle.current = L.circle([lat, lng], {
          radius: accuracy,
          color: "hsl(var(--primary))",
          fillColor: "hsl(var(--primary))",
          fillOpacity: 0.05,
          weight: 1,
        }).addTo(mapInstance.current);
      }
    }
  }, [lat, lng, accuracy]);

  const accuracyLabel = accuracy
    ? accuracy <= 20
      ? { text: "Excellent", pct: 98 }
      : accuracy <= 50
      ? { text: "Bon", pct: 85 }
      : { text: "Moyen", pct: 65 }
    : { text: "Précis", pct: 90 };

  const lastUpdate = (() => {
    const diff = Math.round((Date.now() - updatedAt.getTime()) / 1000);
    if (diff < 5) return "à l'instant";
    if (diff < 60) return `il y a ${diff}s`;
    return `il y a ${Math.round(diff / 60)}min`;
  })();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
            Localisation
          </h2>
          <h3 className="font-display text-base font-bold text-foreground">
            Votre position
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/15">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-tight">
            {locating ? "Recherche…" : "Signal GPS actif"}
          </span>
        </div>
      </div>

      {/* Map module */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-56 w-full rounded-3xl overflow-hidden border border-border shadow-lg"
      >
        <div ref={mapRef} className="absolute inset-0 z-0" />

        {/* Locating overlay */}
        {locating && (
          <div className="absolute inset-0 z-10 bg-card/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 bg-card/90 px-4 py-2 rounded-full shadow-md">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-semibold text-foreground">
                Localisation en cours…
              </span>
            </div>
          </div>
        )}

        {/* Recenter button */}
        <button
          onClick={onRecenter}
          aria-label="Recentrer"
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-card shadow-lg rounded-2xl flex items-center justify-center text-primary active:scale-95 transition-transform border border-border"
        >
          <Crosshair className="w-5 h-5" strokeWidth={2.4} />
        </button>

        {/* Floating address pill */}
        <div className="absolute bottom-3 inset-x-3 z-10">
          <div className="bg-card/95 backdrop-blur-md p-3 rounded-2xl border border-border shadow-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-accent" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                Adresse actuelle
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {address || "Position non disponible"}
              </p>
            </div>
            <div className="flex flex-col items-end leading-tight">
              <span className="text-[11px] font-bold text-primary">
                {accuracyLabel.pct}%
              </span>
              <span className="text-[8px] text-primary/70 font-semibold uppercase tracking-wider">
                {accuracyLabel.text}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer micro-info */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-muted-foreground font-medium">
          Mise à jour {lastUpdate}
        </p>
        {accuracy && (
          <p className="text-[10px] text-muted-foreground font-medium">
            ±{Math.round(accuracy)} m
          </p>
        )}
      </div>
    </div>
  );
};

export default UserLocationCard;
