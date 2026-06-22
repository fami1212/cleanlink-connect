import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(conversationId || null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ name: string; avatar?: string }>({ name: "..." });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversation partner info
  useEffect(() => {
    if (!conversationId || !user) return;
    const fetchPartner = async () => {
      const { data: conv } = await supabase
        .from("conversations")
        .select("client_id, provider_id")
        .eq("id", conversationId)
        .single();

      if (!conv) return;

      const isClient = conv.client_id === user.id;
      let otherUserId: string | null = null;

      if (isClient) {
        const { data: provider } = await supabase
          .from("providers")
          .select("user_id")
          .eq("id", conv.provider_id)
          .single();
        otherUserId = provider?.user_id || null;
      } else {
        otherUserId = conv.client_id;
      }

      if (otherUserId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("user_id", otherUserId)
          .single();
        setOtherUser({
          name: profile?.full_name || "Utilisateur",
          avatar: profile?.avatar_url || undefined,
        });
      }
    };
    fetchPartner();
  }, [conversationId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    await sendMessage(input);
    setInput("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Glass header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/40 safe-area-top px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/app/messages")}
            className="w-10 h-10 rounded-full glass flex items-center justify-center ring-1 ring-border/60 hover:ring-accent/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <Avatar className="w-10 h-10 ring-2 ring-accent/30">
            {otherUser.avatar && <AvatarImage src={otherUser.avatar} />}
            <AvatarFallback className="bg-gradient-emerald text-primary-foreground text-sm font-bold">
              {otherUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-sm font-bold text-foreground truncate">{otherUser.name}</h1>
            <p className="text-[10px] uppercase tracking-[0.14em] text-accent font-semibold">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-gradient-to-b from-muted/30 to-background">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className={cn("h-10 rounded-2xl", i % 2 === 0 ? "w-48 ml-auto" : "w-56")} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-emerald flex items-center justify-center mb-4 shadow-green">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Envoyez votre premier message
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={cn("flex animate-fade-in", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                    isMine
                      ? "bg-gradient-emerald text-primary-foreground rounded-br-md"
                      : "bg-card border border-border text-foreground rounded-bl-md"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1 font-medium",
                      isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}
                  >
                    {format(new Date(msg.created_at), "HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 glass-strong border-t border-border/40 p-3 safe-area-bottom">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre message..."
            className="flex-1 rounded-full bg-muted/80 border-border/40 focus-visible:ring-1 focus-visible:ring-accent h-11"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="rounded-full w-11 h-11 shrink-0 bg-gradient-gold text-accent-foreground hover:opacity-95 shadow-gold disabled:opacity-40 disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
