import { Home, MapPin, MessageCircle, User, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useI18n } from "@/lib/i18n";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useUnreadMessages();
  const { t } = useI18n();

  const leftItems = [
    { icon: Home, label: t("nav.home"), path: "/app", badge: 0 },
    { icon: MapPin, label: t("nav.tracking"), path: "/app/tracking", badge: 0 },
  ];
  const rightItems = [
    { icon: MessageCircle, label: t("nav.messages"), path: "/app/messages", badge: unreadCount },
    { icon: User, label: t("nav.profile"), path: "/app/profile", badge: 0 },
  ];

  const renderItem = (item: { icon: typeof Home; label: string; path: string; badge: number }) => {
    const isActive = location.pathname === item.path;
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200 active:scale-95",
          isActive
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-primary-foreground focus-visible:text-primary-foreground focus-visible:outline-none"
        )}
      >
        {!isActive && (
          <span className="absolute inset-0 rounded-xl bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
        )}
        {isActive && (
          <motion.div
            layoutId="bottomnav-pill"
            className="absolute inset-0 bg-gradient-emerald rounded-xl shadow-green"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        <div className="relative">
          <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
          {item.badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md ring-2 ring-card">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          )}
        </div>
        <span className="relative text-[10px] font-semibold leading-none">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom pointer-events-none">
      <div className="px-3 pb-3 pt-2 flex justify-center pointer-events-auto">
        <div className="relative bg-card/95 backdrop-blur-xl shadow-float rounded-2xl border border-border/60 flex items-center gap-1 p-1.5 w-full max-w-md">
          {leftItems.map(renderItem)}

          <button
            onClick={() => navigate("/app/order")}
            aria-label="Commander"
            className="relative -mt-7 shrink-0 w-14 h-14 rounded-2xl bg-gradient-emerald text-primary-foreground shadow-green flex items-center justify-center border-4 border-background transition-transform duration-200 active:scale-90 hover:scale-105"
          >
            <Plus className="w-6 h-6" strokeWidth={2.6} />
          </button>

          {rightItems.map(renderItem)}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
