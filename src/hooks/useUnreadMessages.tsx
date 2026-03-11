import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useNotificationSound } from "./useNotificationSound";

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const { playSound, initializeAudio } = useNotificationSound();
  const initialLoadDone = useRef(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // Get all conversation IDs where user is participant
    const { data: convs } = await supabase
      .from("conversations")
      .select("id");

    if (!convs || convs.length === 0) {
      setUnreadCount(0);
      return;
    }

    const convIds = convs.map((c) => c.id);

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("conversation_id", convIds)
      .eq("is_read", false)
      .neq("sender_id", user.id);

    setUnreadCount(count || 0);
  }, [user]);

  useEffect(() => {
    fetchUnreadCount().then(() => {
      initialLoadDone.current = true;
    });
  }, [fetchUnreadCount]);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handler = () => {
      initializeAudio();
      window.removeEventListener("click", handler);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [initializeAudio]);

  // Realtime: listen for new messages and play sound
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("unread-messages-badge")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as { sender_id: string };
          if (msg.sender_id !== user.id) {
            setUnreadCount((prev) => prev + 1);
            if (initialLoadDone.current) {
              playSound();
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        () => {
          // Refetch on read status changes
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, playSound, fetchUnreadCount]);

  return { unreadCount, refetch: fetchUnreadCount };
};
