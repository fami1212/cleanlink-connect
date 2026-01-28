import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, MessageSquare, Truck, Star, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Notifications = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    orderUpdates: true,
    providerArrival: true,
    promotions: false,
    ratings: true,
    payments: true,
    sms: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Préférence mise à jour");
  };

  const notificationOptions = [
    {
      key: "orderUpdates" as const,
      icon: Truck,
      title: "Mises à jour des commandes",
      description: "Statut de vos commandes en temps réel",
    },
    {
      key: "providerArrival" as const,
      icon: Bell,
      title: "Arrivée du prestataire",
      description: "Notification quand le camion arrive",
    },
    {
      key: "ratings" as const,
      icon: Star,
      title: "Demandes de notation",
      description: "Rappels pour noter les prestations",
    },
    {
      key: "payments" as const,
      icon: CreditCard,
      title: "Confirmations de paiement",
      description: "Reçus et confirmations de transactions",
    },
    {
      key: "promotions" as const,
      icon: MessageSquare,
      title: "Promotions et offres",
      description: "Réductions et offres spéciales",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Notifications
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {notificationOptions.map((option, index) => (
            <div
              key={option.key}
              className={`flex items-center gap-4 p-4 ${
                index !== notificationOptions.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <option.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              <Switch
                checked={settings[option.key]}
                onCheckedChange={() => toggleSetting(option.key)}
              />
            </div>
          ))}
        </div>

        {/* SMS option */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Notifications SMS</h3>
              <p className="text-sm text-muted-foreground">
                Recevoir aussi par SMS (frais opérateur)
              </p>
            </div>
            <Switch
              checked={settings.sms}
              onCheckedChange={() => toggleSetting("sms")}
            />
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center px-4">
          Vous pouvez modifier vos préférences de notification à tout moment. 
          Les notifications essentielles de sécurité ne peuvent pas être désactivées.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
