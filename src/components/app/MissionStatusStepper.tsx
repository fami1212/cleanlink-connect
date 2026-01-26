import { Check, Navigation, MapPin, Wrench, Flag } from "lucide-react";
import { OrderStatus } from "@/types/database";

interface MissionStatusStepperProps {
  currentStatus: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
  isLoading?: boolean;
}

const steps = [
  { status: "accepted" as OrderStatus, label: "Acceptée", icon: Check },
  { status: "in_progress" as OrderStatus, label: "En route", icon: Navigation, actionLabel: "Je suis en route" },
  { status: "arrived" as OrderStatus, label: "Arrivé", icon: MapPin, actionLabel: "Je suis arrivé" },
  { status: "working" as OrderStatus, label: "En cours", icon: Wrench, actionLabel: "Travail commencé" },
  { status: "completed" as OrderStatus, label: "Terminé", icon: Flag, actionLabel: "Mission terminée" },
];

// Map internal status to display status
const getDisplayStatus = (status: OrderStatus): OrderStatus => {
  // For now, we only have accepted, in_progress, completed in DB
  // Map them to our visual steps
  return status;
};

const getStepIndex = (status: OrderStatus): number => {
  const statusMap: Record<string, number> = {
    accepted: 0,
    in_progress: 2, // Skip "en route" for now
    completed: 4,
  };
  return statusMap[status] ?? 0;
};

const MissionStatusStepper = ({
  currentStatus,
  onStatusChange,
  isLoading = false,
}: MissionStatusStepperProps) => {
  const currentIndex = getStepIndex(currentStatus);

  const getNextStatus = (): OrderStatus | null => {
    if (currentStatus === "accepted") return "in_progress";
    if (currentStatus === "in_progress") return "completed";
    return null;
  };

  const getNextActionLabel = (): string => {
    if (currentStatus === "accepted") return "Je suis en route";
    if (currentStatus === "in_progress") return "Terminer la mission";
    return "";
  };

  const nextStatus = getNextStatus();

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-1 bg-muted rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.status}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
              >
                <step.icon className="w-3 h-3" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          return (
            <span
              key={step.status}
              className={`text-xs text-center ${
                isCompleted ? "text-primary font-medium" : "text-muted-foreground"
              }`}
              style={{ width: "20%" }}
            >
              {step.label}
            </span>
          );
        })}
      </div>

      {/* Action button */}
      {nextStatus && onStatusChange && (
        <button
          onClick={() => onStatusChange(nextStatus)}
          disabled={isLoading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 transition-colors hover:bg-primary/90"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Mise à jour...</span>
            </div>
          ) : (
            getNextActionLabel()
          )}
        </button>
      )}

      {currentStatus === "completed" && (
        <div className="text-center py-3 bg-primary/10 rounded-xl">
          <span className="text-primary font-medium">✓ Mission terminée avec succès!</span>
        </div>
      )}
    </div>
  );
};

export default MissionStatusStepper;
