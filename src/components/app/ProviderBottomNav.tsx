import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Wallet, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ProviderBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/app/provider", icon: MapPin, label: "Missions" },
    { path: "/app/provider/earnings", icon: Wallet, label: "Revenus" },
    { path: "/app/provider/reviews", icon: Star, label: "Avis" },
    { path: "/app/provider/profile", icon: User, label: "Profil" },
  ];

  const isActive = (path: string) => {
    if (path === "/app/provider") return location.pathname === "/app/provider" || location.pathname === "/app/provider/mission";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 transition-colors relative w-full h-full justify-center",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {active && (
                <motion.div layoutId="provider-nav-indicator" className="absolute top-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ProviderBottomNav;
