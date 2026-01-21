import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Truck, Building2, MapPin } from "lucide-react";
import logo from "@/assets/linkeco-logo.png";

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      icon: User,
      title: "Je suis un client",
      description: "Commander une vidange",
      path: "/app",
    },
    {
      icon: Truck,
      title: "Je suis un prestataire",
      description: "Recevoir des missions",
      path: "/app/provider",
    },
    {
      icon: Building2,
      title: "Collectivités locales",
      description: "Gérer l'assainissement",
      path: "/app",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="p-6 text-center">
        <img src={logo} alt="Link'eco" className="h-16 mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold text-foreground">
          Choisir un rôle
        </h1>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-6 space-y-4">
        {roles.map((role) => (
          <button
            key={role.title}
            onClick={() => navigate(role.path)}
            className="w-full flex items-center gap-4 p-5 bg-card border border-border rounded-2xl text-left hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <role.icon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">
                {role.title}
              </h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Location info */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Dakar, Sénégal</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <p className="text-xs text-center text-muted-foreground mb-4">
          En continuant, vous acceptez nos conditions d'utilisation
        </p>
        <Button variant="soft" className="w-full">
          Megane ure <span className="text-primary font-bold ml-1">GON</span>
        </Button>
      </div>
    </div>
  );
};

export default RoleSelect;
