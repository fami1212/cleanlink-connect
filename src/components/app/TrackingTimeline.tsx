import { Clock, MapPin, AlertTriangle, CheckCircle2, Truck, Navigation2 } from "lucide-react";

export type TimelineEventType =
  | "status"
  | "eta"
  | "approaching"
  | "arrived"
  | "delay"
  | "start";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  label: string;
  detail?: string;
  at: Date;
}

const iconFor = (type: TimelineEventType) => {
  switch (type) {
    case "arrived":
      return { Icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-600" };
    case "approaching":
      return { Icon: Navigation2, cls: "bg-amber-500/15 text-amber-600" };
    case "delay":
      return { Icon: AlertTriangle, cls: "bg-destructive/15 text-destructive" };
    case "eta":
      return { Icon: Clock, cls: "bg-primary/15 text-primary" };
    case "start":
      return { Icon: Truck, cls: "bg-accent/15 text-accent" };
    default:
      return { Icon: MapPin, cls: "bg-muted text-muted-foreground" };
  }
};

const formatTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

interface Props {
  events: TimelineEvent[];
  title?: string;
  emptyText?: string;
}

const TrackingTimeline = ({ events, title = "Historique de la mission", emptyText = "En attente d'événements..." }: Props) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        {title}
      </h3>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{emptyText}</p>
      ) : (
        <ol className="relative space-y-4">
          <span className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />
          {events.map((ev) => {
            const { Icon, cls } = iconFor(ev.type);
            return (
              <li key={ev.id} className="relative flex gap-3">
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cls}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{ev.label}</p>
                    <span className="text-xs text-muted-foreground shrink-0 font-mono">{formatTime(ev.at)}</span>
                  </div>
                  {ev.detail && (
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.detail}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default TrackingTimeline;
