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
  interactive = true,
  className = "h-48",
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const providerMarkerRef = useRef<L.Marker | null>(null);
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

  // Update provider marker
  useEffect(() => {
    if (!mapInstanceRef.current || !providerLat || !providerLng) return;

    if (providerMarkerRef.current) {
      providerMarkerRef.current.setLatLng([providerLat, providerLng]);
    } else {
      const providerIcon = L.divIcon({
        html: `<div class="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">🚛</div>`,
        className: "custom-marker",
        iconSize: [32, 32],
      });

      providerMarkerRef.current = L.marker([providerLat, providerLng], {
        icon: providerIcon,
      }).addTo(mapInstanceRef.current);
    }
  }, [providerLat, providerLng]);

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
