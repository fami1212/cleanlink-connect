import { MapPin, Clock, Phone, Check, X, Navigation } from "lucide-react";
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
    <div className="bg-card border-2 border-primary rounded-xl overflow-hidden">
      <div className="p-4">
        {/* Client info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
            <span className="font-bold text-primary-foreground">{initials || "CL"}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-foreground">
              Client
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
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
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span className="text-foreground">{order.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {serviceLabels[order.service_type] || order.service_type}
            </span>
          </div>
          {order.notes && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2">
              {order.notes}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mb-4">
          <span className="text-sm text-muted-foreground">Rémunération</span>
          <span className="font-display font-bold text-primary">{price}</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={onRefuse}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Refuser
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={onAccept}
              disabled={isLoading}
            >
              <Check className="w-4 h-4 mr-2" />
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
