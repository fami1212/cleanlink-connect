import { LucideIcon } from "lucide-react";
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
        "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.98]",
        variant === "featured"
          ? "bg-gradient-to-r from-primary to-linkeco-green-light text-primary-foreground shadow-lg"
          : "bg-card border border-border hover:border-primary/30 hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          variant === "featured"
            ? "bg-primary-foreground/20"
            : "bg-primary/10"
        )}
      >
        <Icon className={cn("w-6 h-6", variant === "featured" ? "text-primary-foreground" : "text-primary")} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-display font-semibold text-base truncate",
          variant === "featured" ? "text-primary-foreground" : "text-foreground"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm truncate",
          variant === "featured" ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {description}
        </p>
      </div>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        variant === "featured" ? "bg-primary-foreground/20" : "bg-muted"
      )}>
        <svg
          className={cn("w-4 h-4", variant === "featured" ? "text-primary-foreground" : "text-muted-foreground")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default ServiceCard;
