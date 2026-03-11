import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Conversation {
  id: string;
  order_id: string;
  client_id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
  other_name?: string;
  other_avatar?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
      return;
    }

    // Enrich with participant info and last message
    const enriched = await Promise.all(
      (data || []).map(async (conv: any) => {
        // Determine if current user is client or provider
        const isClient = conv.client_id === user.id;
        let otherUserId: string | null = null;

        if (isClient) {
          // Get provider's user_id
          const { data: provider } = await supabase
            .from("providers")
            .select("user_id")
            .eq("id", conv.provider_id)
            .single();
          otherUserId = provider?.user_id || null;
        } else {
          otherUserId = conv.client_id;
        }

        // Get other user's profile
        let otherName = "Utilisateur";
        let otherAvatar: string | undefined;
        if (otherUserId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", otherUserId)
            .single();
          otherName = profile?.full_name || "Utilisateur";
          otherAvatar = profile?.avatar_url || undefined;
        }

        // Get last message
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", user.id);

        return {
          ...conv,
          other_name: otherName,
          other_avatar: otherAvatar,
          last_message: lastMsg?.content,
          last_message_at: lastMsg?.created_at,
          unread_count: count || 0,
        } as Conversation;
      })
    );

    setConversations(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
};

export const useChat = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
    setLoading(false);

    // Mark unread messages as read
    if (user) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .neq("sender_id", user.id);
    }
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          // Mark as read if not sender
          if (user && newMsg.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !conversationId || !content.trim()) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
    });

    if (error) console.error("Error sending message:", error);
  };

  return { messages, loading, sendMessage };
};

export const useGetOrCreateConversation = () => {
  const { user } = useAuth();

  const getOrCreate = async (orderId: string, providerId: string) => {
    if (!user) return null;

    // Check existing
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("order_id", orderId)
      .single();

    if (existing) return existing.id;

    // Create new
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        order_id: orderId,
        client_id: user.id,
        provider_id: providerId,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
    return data?.id || null;
  };

  return { getOrCreate };
};
