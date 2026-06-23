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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none">
      <div className="px-3 pb-3 pt-2 flex justify-center pointer-events-auto">
        <div className="glass-strong shadow-float rounded-2xl border border-foreground/5 flex items-center gap-1 p-1.5 w-full max-w-md">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-accent hover:bg-accent/10"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="provider-nav-pill"
                    className="absolute inset-0 bg-gradient-emerald rounded-xl shadow-green"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="relative w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                <span className="relative text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ProviderBottomNav;
