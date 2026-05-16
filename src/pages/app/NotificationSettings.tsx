import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, MessageSquare, Truck, Star, CreditCard, Navigation2, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTrackingPreferences, ProximityThreshold } from "@/hooks/useTrackingPreferences";

const Notifications = () => {
  const navigate = useNavigate();
  const { prefs, update: updatePrefs } = useTrackingPreferences();
  
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

        {/* Tracking & proximity preferences */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Navigation2 className="w-4 h-4 text-primary" />
              Suivi en temps réel
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Contrôlez les alertes liées à l'approche du prestataire et aux retards.
            </p>
          </div>

          {/* Proximity alerts */}
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Navigation2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Alertes de proximité</h4>
              <p className="text-sm text-muted-foreground">Soyez prévenu quand le prestataire approche</p>
            </div>
            <Switch
              checked={prefs.proximityAlerts}
              onCheckedChange={(v) => {
                updatePrefs({ proximityAlerts: v });
                toast.success("Préférence mise à jour");
              }}
            />
          </div>

          {/* Threshold selector */}
          {prefs.proximityAlerts && (
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium text-foreground mb-2">Seuil de proximité</p>
              <div className="flex gap-2">
                {([200, 500, 1000] as ProximityThreshold[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => updatePrefs({ proximityThreshold: t })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      prefs.proximityThreshold === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {t < 1000 ? `${t} m` : `${t / 1000} km`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Arrival */}
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Notification d'arrivée</h4>
              <p className="text-sm text-muted-foreground">Quand le prestataire est sur place</p>
            </div>
            <Switch
              checked={prefs.arrivalAlerts}
              onCheckedChange={(v) => updatePrefs({ arrivalAlerts: v })}
            />
          </div>

          {/* Delay */}
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Alertes de retard</h4>
              <p className="text-sm text-muted-foreground">
                Seuil: +{prefs.delayThresholdMin} min vs estimation initiale
              </p>
            </div>
            <Switch
              checked={prefs.delayAlerts}
              onCheckedChange={(v) => updatePrefs({ delayAlerts: v })}
            />
          </div>
        </div>

        {/* SMS option */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Notifications SMS</h4>
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
