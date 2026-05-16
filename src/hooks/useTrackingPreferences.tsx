import { useEffect, useState, useCallback } from "react";

const KEY = "linkeco.tracking.prefs.v1";

export type ProximityThreshold = 200 | 500 | 1000;

export interface TrackingPreferences {
  proximityAlerts: boolean;
  proximityThreshold: ProximityThreshold; // meters
  arrivalAlerts: boolean;
  delayAlerts: boolean;
  delayThresholdMin: number; // minutes increase vs initial ETA
  soundEnabled: boolean;
}

const DEFAULTS: TrackingPreferences = {
  proximityAlerts: true,
  proximityThreshold: 500,
  arrivalAlerts: true,
  delayAlerts: true,
  delayThresholdMin: 10,
  soundEnabled: true,
};

const read = (): TrackingPreferences => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
};

export const useTrackingPreferences = () => {
  const [prefs, setPrefs] = useState<TrackingPreferences>(read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setPrefs(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((patch: Partial<TrackingPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { prefs, update };
};
