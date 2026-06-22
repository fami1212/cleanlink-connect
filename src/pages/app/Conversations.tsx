import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/useMessages";
import BottomNav from "@/components/app/BottomNav";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Conversations = () => {
  const navigate = useNavigate();
  const { conversations, loading } = useConversations();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Glass header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/40 safe-area-top px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center ring-1 ring-border/60 hover:ring-accent/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">Messagerie</p>
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">Conversations</h1>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-150px)]">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-hero-dark flex items-center justify-center mb-5 shadow-float relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
              <span className="text-3xl relative">💬</span>
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Aucune conversation</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Les messages apparaîtront ici lorsque vous aurez une commande en cours.
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/app/chat/${conv.id}`)}
                className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-2xl hover:border-accent/40 hover:shadow-md transition-all text-left active:scale-[0.99]"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-accent/20">
                    {conv.other_avatar && <AvatarImage src={conv.other_avatar} />}
                    <AvatarFallback className="bg-gradient-emerald text-primary-foreground font-bold">
                      {(conv.other_name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(conv.unread_count || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-gold text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-gold">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-foreground text-sm truncate">
                      {conv.other_name}
                    </span>
                    {conv.last_message_at && (
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0 font-medium">
                        {formatDistanceToNow(new Date(conv.last_message_at), {
                          addSuffix: false,
                          locale: fr,
                        })}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${(conv.unread_count || 0) > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {conv.last_message || "Démarrer la conversation..."}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      <BottomNav />
    </div>
  );
};

export default Conversations;
