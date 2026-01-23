import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, MapPin, Clock, Star, RefreshCw } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const serviceTypeLabels: Record<string, string> = {
  fosse_septique: "Vidange fosse septique",
  latrines: "Vidange latrines",
  urgence: "Urgence débordement",
  curage: "Curage canalisations",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-500" },
  accepted: { label: "Acceptée", color: "bg-blue-500" },
  in_progress: { label: "En cours", color: "bg-primary" },
  completed: { label: "Terminée", color: "bg-green-500" },
  cancelled: { label: "Annulée", color: "bg-destructive" },
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Historique des commandes
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Aucune commande
            </h3>
            <p className="text-sm text-muted-foreground">
              Vos commandes apparaîtront ici
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const statusInfo = statusLabels[order.status] || statusLabels.pending;
            return (
              <button
                key={order.id}
                onClick={() => navigate("/app/tracking", { state: { orderId: order.id } })}
                className="w-full bg-card border border-border rounded-xl p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {serviceTypeLabels[order.service_type]}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(order.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{order.address}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    {order.rating ? (
                      <>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= order.rating!
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Non noté</span>
                    )}
                  </div>
                  <span className="font-display font-semibold text-primary">
                    {(order.final_price || order.price_min || 0).toLocaleString()} FCFA
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
