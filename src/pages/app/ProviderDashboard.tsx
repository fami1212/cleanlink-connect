import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, Clock, Check, X, Star, TrendingUp, Wallet } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import logo from "@/assets/linkeco-logo.png";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [showMissionDetail, setShowMissionDetail] = useState(false);

  const stats = [
    { icon: TrendingUp, label: "Missions aujourd'hui", value: "3" },
    { icon: Wallet, label: "Gains aujourd'hui", value: "75 000 FCFA" },
    { icon: Star, label: "Note moyenne", value: "4.8" },
  ];

  const pendingMission = {
    id: 1,
    client: "Boubacar Camara",
    address: "Rue Meya, Dakar",
    service: "Vidange fosse septique",
    price: "25 000 FCFA",
    distance: "3.2 km",
    time: "15 min",
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card safe-area-top">
        <div className="flex items-center justify-between p-4">
          <img src={logo} alt="Link'eco" className="h-10" />
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">BC</span>
            </div>
          </div>
        </div>

        {/* Online status */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <div>
                <p className="font-medium text-foreground">
                  {isOnline ? "En ligne" : "Hors ligne"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isOnline ? "Prêt à recevoir des missions" : "Vous ne recevez pas de missions"}
                </p>
              </div>
            </div>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-3 text-center"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending missions */}
      <div className="px-4">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Nouvelle mission
        </h2>

        {isOnline ? (
          <div className="bg-card border-2 border-primary rounded-xl overflow-hidden animate-pulse-slow">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary-foreground">BC</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">
                    {pendingMission.client}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{pendingMission.distance}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{pendingMission.time}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{pendingMission.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{pendingMission.service}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mb-4">
                <span className="text-sm text-muted-foreground">Rémunération</span>
                <span className="font-display font-bold text-primary">{pendingMission.price}</span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Refuser
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={() => navigate("/app/provider/mission")}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accepter
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Vous êtes hors ligne
            </h3>
            <p className="text-sm text-muted-foreground">
              Activez votre statut pour recevoir des missions
            </p>
          </div>
        )}
      </div>

      {/* Recent missions */}
      <div className="px-4 py-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Missions récentes
        </h2>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Vidange fosse septique</p>
                <p className="text-sm text-muted-foreground">Médina, Dakar • Aujourd'hui</p>
              </div>
              <span className="font-display font-semibold text-primary">25 000 F</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav for provider */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          <button className="flex flex-col items-center gap-1 text-primary">
            <MapPin className="w-5 h-5" />
            <span className="text-xs font-medium">Missions</span>
          </button>
          <button
            onClick={() => navigate("/app/profile")}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs font-medium">Revenus</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Star className="w-5 h-5" />
            <span className="text-xs font-medium">Avis</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ProviderDashboard;
