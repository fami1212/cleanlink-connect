import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Provider } from "@/hooks/useProviders";

interface ProvidersMapProps {
  providers: Provider[];
  onSelectProvider: (p: Provider) => void;
}

const ProvidersMap = ({ providers, onSelectProvider }: ProvidersMapProps) => {
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

export default ProvidersMap;
