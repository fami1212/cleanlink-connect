import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  variant?: "default" | "featured";
}

const ServiceCard = ({ icon: Icon, title, description, onClick, variant = "default" }: ServiceCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.98]",
        variant === "featured"
          ? "bg-primary text-primary-foreground shadow-green"
          : "bg-card border border-border hover:border-primary/20 hover:shadow-card"
      )}
    >
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
        variant === "featured" ? "bg-white/15" : "bg-primary/8"
      )}>
        <Icon className={cn("w-5 h-5", variant === "featured" ? "text-primary-foreground" : "text-primary")} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={cn("font-display font-semibold text-[15px]", variant === "featured" ? "text-primary-foreground" : "text-foreground")}>
          {title}
        </h3>
        <p className={cn("text-xs", variant === "featured" ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {description}
        </p>
      </div>
      <ChevronRight className={cn("w-4 h-4 shrink-0", variant === "featured" ? "text-primary-foreground/50" : "text-muted-foreground")} />
    </button>
  );
};

export default ServiceCard;
