import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Truck, Building2, MapPin, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/linkeco-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { roles, loading: roleLoading, addRole } = useUserRole();

  useEffect(() => {
    if (!authLoading && !roleLoading && user) {
      if (roles.includes("provider")) {
        navigate("/app/provider", { replace: true });
      } else if (roles.includes("client") || roles.length > 0) {
        navigate("/app", { replace: true });
      }
    }
  }, [user, authLoading, roleLoading, roles, navigate]);

  const handleRoleSelect = async (roleType: "client" | "provider" | "authority", path: string) => {
    if (user) {
      await addRole(roleType);
      navigate(path, { replace: true });
    } else {
      navigate("/app/auth", { state: { intendedRole: roleType, redirectTo: path } });
    }
  };

  const roleOptions = [
    {
      icon: User,
      title: "Je suis un client",
      description: "Commander une vidange",
      roleType: "client" as const,
      path: "/app",
      gradient: "from-primary to-primary-glow",
      accentColor: "primary",
    },
    {
      icon: Truck,
      title: "Je suis un prestataire",
      description: "Recevoir des missions",
      roleType: "provider" as const,
      path: "/app/provider",
      gradient: "from-[hsl(43_70%_50%)] to-[hsl(38_85%_58%)]",
      accentColor: "accent",
    },
    {
      icon: Building2,
      title: "Collectivités locales",
      description: "Gérer l'assainissement",
      roleType: "authority" as const,
      path: "/app",
      gradient: "from-[hsl(178_50%_25%)] to-[hsl(178_45%_40%)]",
      accentColor: "secondary",
    },
  ];

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-70 pointer-events-none" />
      <motion.div
        className="absolute -top-20 -right-20 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative px-6 pt-8 pb-6 text-center"
      >
        <img src={logo} alt="Link'eco" className="h-14 mx-auto mb-5" />
        <div className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 mb-3">
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-[11px] font-semibold text-foreground tracking-wide">Choisissez votre espace</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Bienvenue {user ? user.user_metadata?.full_name?.split(" ")[0] || "" : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comment souhaitez-vous utiliser Link'eco ?
        </p>
      </motion.div>

      {/* Role cards */}
      <div className="relative flex-1 px-5 space-y-3">
        {roleOptions.map((role, i) => (
          <motion.button
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect(role.roleType, role.path)}
            className="group relative w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl text-left hover:border-foreground/15 hover:shadow-float transition-all overflow-hidden"
          >
            {/* Halo */}
            <div className={`absolute -left-8 -top-8 w-28 h-28 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-opacity`} />

            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shrink-0 shadow-md`}>
              <role.icon className="w-7 h-7 text-white" strokeWidth={2.2} />
            </div>
            <div className="relative flex-1 min-w-0">
              <h3 className="font-display font-bold text-foreground text-base">
                {role.title}
              </h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
            <div className="relative w-9 h-9 rounded-full bg-foreground/5 group-hover:bg-foreground group-hover:text-background flex items-center justify-center transition-all">
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative px-6 py-4 flex justify-center"
      >
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground glass rounded-full px-3 py-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium">Dakar, Sénégal</span>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative px-6 pb-6">
        <p className="text-[11px] text-center text-muted-foreground/70 mb-3 leading-relaxed">
          En continuant, vous acceptez nos <span className="underline">conditions d'utilisation</span>
        </p>
        {!user && (
          <Button
            variant="ghost"
            className="w-full rounded-xl hover:bg-foreground/5"
            onClick={() => navigate("/app/auth")}
          >
            Déjà un compte ? <span className="text-primary font-bold ml-1">Connexion</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoleSelect;
