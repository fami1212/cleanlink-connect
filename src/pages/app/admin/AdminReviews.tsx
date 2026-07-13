import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Star, MessageSquareWarning } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const AdminReviews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"flagged" | "hidden" | "all">("flagged");

  const load = async () => {
    setLoading(true);
    let q = (supabase.from("orders") as any)
      .select("id, rating, review_comment, review_hidden, review_flag_reason, client_id, provider_id, completed_at")
      .not("rating", "is", null)
      .order("completed_at", { ascending: false });
    if (filter === "flagged") q = q.not("review_flag_reason", "is", null);
    if (filter === "hidden") q = q.eq("review_hidden", true);
    const { data, error } = await q.limit(100);
    if (error) toast.error(error.message);
    setReviews(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const toggleHide = async (id: string, hide: boolean) => {
    const { error } = await (supabase.from("orders") as any)
      .update({
        review_hidden: hide,
        review_moderated_at: new Date().toISOString(),
        review_moderated_by: user?.id ?? null,
      })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(hide ? "Avis masqué" : "Avis rétabli");
      load();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="bg-card border-b border-border safe-area-top sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate("/app/admin")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">Modération avis</h1>
        </div>
        <div className="flex gap-2 px-4 pb-3">
          {(["flagged", "hidden", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "flagged" ? "Signalés" : f === "hidden" ? "Masqués" : "Tous"}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquareWarning className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Aucun avis à modérer.</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className={`bg-card border rounded-2xl p-4 space-y-2 ${r.review_hidden ? "opacity-60 border-red-200" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < (r.rating ?? 0) ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                {r.review_flag_reason && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">⚠ {r.review_flag_reason}</span>
                )}
              </div>
              {r.review_comment && <p className="text-sm">{r.review_comment}</p>}
              <div className="flex gap-2">
                {r.review_hidden ? (
                  <Button size="sm" variant="outline" onClick={() => toggleHide(r.id, false)}>
                    <Eye className="w-4 h-4 mr-1" /> Rétablir
                  </Button>
                ) : (
                  <Button size="sm" variant="destructive" onClick={() => toggleHide(r.id, true)}>
                    <EyeOff className="w-4 h-4 mr-1" /> Masquer
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default AdminReviews;
