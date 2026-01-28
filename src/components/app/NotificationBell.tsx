import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = ({ className = "" }: NotificationBellProps) => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <button
      onClick={() => navigate("/app/notifications")}
      className={`relative w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md ${className}`}
    >
      <Bell className="w-5 h-5 text-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
