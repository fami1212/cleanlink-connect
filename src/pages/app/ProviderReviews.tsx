import { ArrowLeft, Star, ThumbsUp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProviderStats } from "@/hooks/useProviderStats";
import { useProviderOrders } from "@/hooks/useProviderOrders";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";

const ProviderReviews = () => {
  const navigate = useNavigate();
  const { stats, loading } = useProviderStats();
  const { completedOrders } = useProviderOrders();

  const reviewedOrders = completedOrders.filter((order) => order.rating);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-card safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/app/provider")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Avis clients
          </h1>
        </div>
      </div>

      {/* Rating summary */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-primary">
                {stats.averageRating || "-"}
              </p>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewedOrders.filter((o) => o.rating === rating).length;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Basé sur {stats.totalReviews} avis client{stats.totalReviews > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <ThumbsUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-display text-2xl font-bold text-foreground">
              {stats.totalReviews > 0
                ? Math.round((reviewedOrders.filter((o) => (o.rating || 0) >= 4).length / stats.totalReviews) * 100)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Clients satisfaits</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <MessageCircle className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="font-display text-2xl font-bold text-foreground">
              {stats.totalMissions}
            </p>
            <p className="text-sm text-muted-foreground">Missions terminées</p>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="px-4 py-4">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Derniers avis
        </h2>

        {reviewedOrders.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center border border-border">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground mb-1">Aucun avis pour le moment</p>
            <p className="text-sm text-muted-foreground">
              Vos avis clients apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviewedOrders.slice(0, 10).map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(order.rating || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.address}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {order.completed_at
                      ? new Date(order.completed_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })
                      : ""}
                  </span>
                </div>
                {order.notes && (
                  <p className="text-sm text-foreground bg-muted/50 rounded-lg p-2 mt-2">
                    "{order.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderReviews;
