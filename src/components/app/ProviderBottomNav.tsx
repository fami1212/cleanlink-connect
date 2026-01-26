import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Wallet, Star, User } from "lucide-react";

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
    if (path === "/app/provider") {
      return location.pathname === "/app/provider" || location.pathname === "/app/provider/mission";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ProviderBottomNav;
