import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CheckCheck, Loader2, Package, AlertTriangle, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import BottomNav from "@/components/app/BottomNav";

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "new_order":
      return <Package className="w-5 h-5 text-primary" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-accent" />;
    default:
      return <Info className="w-5 h-5 text-primary/70" />;
  }
};

const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.is_read) {
      onRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === "new_order" && notification.data?.order_id) {
      navigate(`/app/provider/mission/${notification.data.order_id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
        notification.is_read
          ? "bg-card"
          : "bg-primary/5 border-l-4 border-primary"
      }`}
    >
      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${
            notification.is_read ? "text-foreground" : "text-primary"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
            locale: fr,
          })}
        </p>
      </div>
      {!notification.is_read && (
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
      )}
    </button>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-primary"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Tout lire
              </Button>
            )}
            <button
              onClick={() => navigate("/app/profile/notification-settings")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">
            Aucune notification
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Vous recevrez des notifications ici concernant vos commandes et
            missions.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
            />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Notifications;
