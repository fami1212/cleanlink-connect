import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMyProvider } from "./useProviders";
import { Geolocation } from "@capacitor/geolocation";

interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface UseGeolocationOptions {
  enableTracking?: boolean;
  updateInterval?: number; // in milliseconds
  highAccuracy?: boolean;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableTracking = false,
    updateInterval = 30000, // 30 seconds default
    highAccuracy = true,
  } = options;

  const { provider, updateProvider } = useMyProvider();
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get current position once
  const getCurrentPosition = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await Geolocation.getCurrentPosition({
        enableHighAccuracy: highAccuracy,
        timeout: 10000,
      });

      const newPosition: Position = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
        timestamp: result.timestamp,
      };

      setPosition(newPosition);
      setLoading(false);
      return newPosition;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur de géolocalisation";
      setError(errorMessage);
      setLoading(false);
      
      // Fallback to browser geolocation
      if ("geolocation" in navigator) {
        return new Promise<Position>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const newPosition: Position = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp,
              };
              setPosition(newPosition);
              setError(null);
              resolve(newPosition);
            },
            (err) => {
              setError(err.message);
              reject(err);
            },
            { enableHighAccuracy: highAccuracy, timeout: 10000 }
          );
        });
      }
      
      throw err;
    }
  }, [highAccuracy]);

  // Update provider position in database
  const updateProviderPosition = useCallback(async () => {
    if (!provider) return;

    try {
      const pos = await getCurrentPosition();
      if (pos) {
        await updateProvider({
          latitude: pos.latitude,
          longitude: pos.longitude,
        });

        // Update last_location_at timestamp
        await supabase
          .from("providers")
          .update({ last_location_at: new Date().toISOString() })
          .eq("id", provider.id);
      }
    } catch (err) {
      console.error("Error updating provider position:", err);
    }
  }, [provider, getCurrentPosition, updateProvider]);

  // Start continuous tracking
  const startTracking = useCallback(async () => {
    if (watchIdRef.current) return;

    try {
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: highAccuracy },
        (pos, err) => {
          if (err) {
            setError(err.message);
            return;
          }
          if (pos) {
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp,
            });
          }
        }
      );
      watchIdRef.current = id;

      // Set up interval to update database
      intervalRef.current = setInterval(() => {
        updateProviderPosition();
      }, updateInterval);

      // Initial update
      updateProviderPosition();
    } catch (err) {
      console.error("Error starting tracking:", err);
      
      // Fallback to browser watchPosition
      if ("geolocation" in navigator) {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: pos.timestamp,
            });
          },
          (err) => setError(err.message),
          { enableHighAccuracy: highAccuracy }
        );
        watchIdRef.current = String(watchId);

        intervalRef.current = setInterval(() => {
          updateProviderPosition();
        }, updateInterval);

        updateProviderPosition();
      }
    }
  }, [highAccuracy, updateInterval, updateProviderPosition]);

  // Stop tracking
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current) {
      try {
        await Geolocation.clearWatch({ id: watchIdRef.current });
      } catch {
        // Fallback for browser
        navigator.geolocation.clearWatch(Number(watchIdRef.current));
      }
      watchIdRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Calculate distance to a destination
  const getDistanceTo = useCallback(
    (destLat: number, destLng: number): number | null => {
      if (!position) return null;

      const R = 6371; // Earth's radius in km
      const dLat = ((destLat - position.latitude) * Math.PI) / 180;
      const dLng = ((destLng - position.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((position.latitude * Math.PI) / 180) *
          Math.cos((destLat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c * 10) / 10;
    },
    [position]
  );

  // Open external navigation app
  const openNavigation = useCallback(
    (destLat: number, destLng: number, app: "google" | "waze" | "apple" = "google") => {
      let url = "";

      switch (app) {
        case "waze":
          url = `https://waze.com/ul?ll=${destLat},${destLng}&navigate=yes`;
          break;
        case "apple":
          url = `maps://maps.apple.com/?daddr=${destLat},${destLng}`;
          break;
        case "google":
        default:
          url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
          break;
      }

      window.open(url, "_blank");
    },
    []
  );

  // Auto-start/stop tracking based on enableTracking prop
  useEffect(() => {
    if (enableTracking && provider?.is_online) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enableTracking, provider?.is_online, startTracking, stopTracking]);

  return {
    position,
    error,
    loading,
    getCurrentPosition,
    startTracking,
    stopTracking,
    getDistanceTo,
    openNavigation,
    updateProviderPosition,
  };
};
