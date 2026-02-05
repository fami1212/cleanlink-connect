import { useCallback, useRef, useState } from "react";

// Simple beep sound generator using Web Audio API
const createBeepSound = (audioContext: AudioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  return { oscillator, duration: 0.5 };
};

export const useNotificationSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef<number>(0);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;

    // Debounce: don't play more than once per 3 seconds
    const now = Date.now();
    if (now - lastPlayedRef.current < 3000) return;
    lastPlayedRef.current = now;

    try {
      // Create audio context on demand (must be triggered by user interaction first time)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Resume if suspended (browsers require user interaction)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Play two beeps for notification
      const { oscillator: osc1, duration } = createBeepSound(ctx);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + duration);

      // Second beep after short delay
      setTimeout(() => {
        if (audioContextRef.current) {
          const { oscillator: osc2, duration: d2 } = createBeepSound(audioContextRef.current);
          osc2.start(audioContextRef.current.currentTime);
          osc2.stop(audioContextRef.current.currentTime + d2);
        }
      }, 200);
    } catch (err) {
      console.log("Could not play notification sound:", err);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Initialize audio context on first user interaction
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (err) {
        console.log("Could not initialize audio:", err);
      }
    }
  }, []);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playSound,
    initializeAudio,
  };
};
