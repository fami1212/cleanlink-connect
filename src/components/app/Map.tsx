import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapProps {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  providerLat?: number;
  providerLng?: number;
  showRoute?: boolean;
  showTruck?: boolean;
  truckDestination?: { lat: number; lng: number };
  historyPath?: { lat: number; lng: number }[];
  interactive?: boolean;
  className?: string;
}

const Map = ({
  onLocationSelect,
  initialLat = 14.6937,
  initialLng = -17.4441,
  providerLat,
  providerLng,
  showRoute = false,
  showTruck = false,
  truckDestination,
  historyPath,
  interactive = true,
  className = "h-48",
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const providerMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const routeGlowRef = useRef<L.Polyline | null>(null);
  const historyLineRef = useRef<L.Polyline | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add initial marker
    const marker = L.marker([initialLat, initialLng], { draggable: interactive }).addTo(map);
    markerRef.current = marker;

    if (interactive) {
      // Handle marker drag
      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        const address = await reverseGeocode(pos.lat, pos.lng);
        onLocationSelect?.(pos.lat, pos.lng, address);
      });

      // Handle map click
      map.on("click", async (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        onLocationSelect?.(e.latlng.lat, e.latlng.lng, address);
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update provider marker + route polyline
  useEffect(() => {
    const lat = providerLat ?? (showTruck && truckDestination ? truckDestination.lat + 0.01 : undefined);
    const lng = providerLng ?? (showTruck && truckDestination ? truckDestination.lng + 0.01 : undefined);
    const map = mapInstanceRef.current;
    if (!map || lat === undefined || lng === undefined) return;

    if (providerMarkerRef.current) {
      providerMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const providerIcon = L.divIcon({
        html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;">
                 <div style="position:absolute;inset:0;border-radius:50%;background:hsl(var(--accent)/0.25);animation:pulse-ring 2s ease-out infinite;"></div>
                 <div style="position:relative;width:34px;height:34px;border-radius:50%;background:hsl(var(--accent));border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">🚛</div>
               </div>`,
        className: "custom-provider-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      providerMarkerRef.current = L.marker([lat, lng], { icon: providerIcon }).addTo(map);
    }

    // Draw route between provider and destination (client)
    const dest = truckDestination;
    if (dest && showRoute) {
      const drawFallback = () => {
        const coords: [number, number][] = [[lat, lng], [dest.lat, dest.lng]];
        if (routeGlowRef.current) routeGlowRef.current.setLatLngs(coords);
        else routeGlowRef.current = L.polyline(coords, {
          color: "hsl(var(--primary))", opacity: 0.18, weight: 10,
        }).addTo(map);
        if (routeLineRef.current) routeLineRef.current.setLatLngs(coords);
        else routeLineRef.current = L.polyline(coords, {
          color: "hsl(var(--primary))", weight: 4, opacity: 0.9, dashArray: "8 8",
        }).addTo(map);
        try { map.fitBounds(L.latLngBounds(coords).pad(0.25)); } catch {}
      };

      const url = `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const geom = data?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
          if (!geom?.length) return drawFallback();
          const coords: [number, number][] = geom.map(([lng, lat]) => [lat, lng]);
          if (routeGlowRef.current) routeGlowRef.current.setLatLngs(coords);
          else routeGlowRef.current = L.polyline(coords, {
            color: "hsl(var(--primary))", opacity: 0.18, weight: 10,
          }).addTo(map);
          if (routeLineRef.current) routeLineRef.current.setLatLngs(coords);
          else routeLineRef.current = L.polyline(coords, {
            color: "hsl(var(--primary))", weight: 4, opacity: 0.95,
          }).addTo(map);
          try { map.fitBounds(L.latLngBounds(coords).pad(0.2)); } catch {}
        })
        .catch(drawFallback);
    }
  }, [providerLat, providerLng, showTruck, truckDestination?.lat, truckDestination?.lng, showRoute]);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Adresse inconnue";
    } catch {
      return "Adresse inconnue";
    }
  };

  const locateUser = () => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    
    setIsLocating(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          mapInstanceRef.current?.setView([latitude, longitude], 16);
          markerRef.current?.setLatLng([latitude, longitude]);
          
          const address = await reverseGeocode(latitude, longitude);
          onLocationSelect?.(latitude, longitude, address);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
      
      {interactive && (
        <button
          onClick={locateUser}
          disabled={isLocating}
          className="absolute bottom-4 left-4 z-[1000] bg-card shadow-lg rounded-full p-3 hover:bg-muted transition-colors"
          title="Ma position"
        >
          {isLocating ? (
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default Map;
