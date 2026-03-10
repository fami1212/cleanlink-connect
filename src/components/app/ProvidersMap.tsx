import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Provider } from "@/hooks/useProviders";

interface ProvidersMapProps {
  providers: Provider[];
  onSelectProvider: (p: Provider) => void;
  userLat?: number;
  userLng?: number;
  searchRadiusKm?: number;
}

const ProvidersMap = ({
  providers,
  onSelectProvider,
  userLat = 14.6937,
  userLng = -17.4441,
  searchRadiusKm,
}: ProvidersMapProps) => {
  useEffect(() => {
    const container = document.getElementById("providers-map-home");
    if (!container) return;

    const map = L.map(container, {
      center: [userLat, userLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // User position marker
    const userIcon = L.divIcon({
      html: `<div style="background: hsl(var(--accent)); border: 3px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 0 0 4px hsla(var(--accent), 0.25), 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      className: "user-position-marker",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([userLat, userLng], { icon: userIcon, interactive: false }).addTo(map);

    // Search radius circle
    if (searchRadiusKm && searchRadiusKm < 100) {
      L.circle([userLat, userLng], {
        radius: searchRadiusKm * 1000,
        color: "hsl(var(--primary))",
        fillColor: "hsl(var(--primary))",
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: "6 4",
      }).addTo(map);
    }

    const bounds: [number, number][] = [[userLat, userLng]];

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

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else if (searchRadiusKm && searchRadiusKm < 100) {
      map.setZoom(searchRadiusKm <= 5 ? 13 : searchRadiusKm <= 10 ? 12 : 11);
    }

    return () => { map.remove(); };
  }, [providers, onSelectProvider, userLat, userLng, searchRadiusKm]);

  return (
    <div
      id="providers-map-home"
      className="w-full h-48 rounded-2xl overflow-hidden border border-border"
    />
  );
};

export default ProvidersMap;
