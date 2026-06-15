import { Home, MapPin, MessageCircle, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useUnreadMessages();

  const navItems = [
    { icon: Home, label: "Accueil", path: "/app", badge: 0 },
    { icon: MapPin, label: "Suivi", path: "/app/tracking", badge: 0 },
    { icon: MessageCircle, label: "Messages", path: "/app/messages", badge: unreadCount },
    { icon: User, label: "Profil", path: "/app/profile", badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none">
      <div className="px-3 pb-3 pt-2 flex justify-center pointer-events-auto">
        <div className="glass-strong shadow-float rounded-2xl border border-foreground/5 flex items-center gap-1 p-1.5 w-full max-w-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-pill"
                    className="absolute inset-0 bg-gradient-emerald rounded-xl shadow-green"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="relative text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
