import { MapPin, Clock, Phone, Check, X, Navigation, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderWithDistance } from "@/hooks/useProviderOrders";

interface MissionCardProps {
  order: OrderWithDistance;
  onAccept?: () => void;
  onRefuse?: () => void;
  onNavigate?: () => void;
  showActions?: boolean;
  showNavigate?: boolean;
  isLoading?: boolean;
}

const serviceLabels: Record<string, string> = {
  fosse_septique: "Vidange fosse septique",
  latrines: "Vidange latrines",
  urgence: "Intervention urgente",
  curage: "Curage canalisation",
};

const MissionCard = ({
  order,
  onAccept,
  onRefuse,
  onNavigate,
  showActions = true,
  showNavigate = false,
  isLoading = false,
}: MissionCardProps) => {
  const initials = order.address
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const price = order.price_min && order.price_max
    ? `${new Intl.NumberFormat("fr-FR").format(order.price_min)} - ${new Intl.NumberFormat("fr-FR").format(order.price_max)} FCFA`
    : order.final_price
    ? `${new Intl.NumberFormat("fr-FR").format(order.final_price)} FCFA`
    : "À définir";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4">
        {/* Client info */}
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-foreground">
              Nouvelle demande
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{serviceLabels[order.service_type] || order.service_type}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              {order.distance && (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>{order.distance} km</span>
                  <span>•</span>
                </>
              )}
              {order.estimatedTime && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{order.estimatedTime} min</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mission details */}
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="text-foreground">{order.address}</span>
        </div>
        {order.notes && (
          <div className="mb-4 rounded-lg border-l-2 border-accent bg-muted/40 p-3 text-sm text-muted-foreground">
            {order.notes}
          </div>
        )}

        {/* Price */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-accent/25 bg-accent/10 p-3">
          <span className="text-xs font-medium text-muted-foreground">Montant estimé</span>
          <span className="font-display text-sm font-bold text-foreground">{price}</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              onClick={onRefuse}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Refuser
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={onAccept}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
              Accepter
            </Button>
          </div>
        )}

        {showNavigate && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`tel:+221000000000`, "_blank")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={onNavigate}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Naviguer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCard;
