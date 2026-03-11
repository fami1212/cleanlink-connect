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
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Messages</h1>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
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
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Aucune conversation pour le moment. Les messages apparaîtront ici lorsque vous aurez une commande en cours.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => navigate(`/app/chat/${conv.id}`)}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    {conv.other_avatar && <AvatarImage src={conv.other_avatar} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {(conv.other_name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {(conv.unread_count || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm truncate">
                      {conv.other_name}
                    </span>
                    {conv.last_message_at && (
                      <span className="text-[11px] text-muted-foreground ml-2 shrink-0">
                        {formatDistanceToNow(new Date(conv.last_message_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
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
