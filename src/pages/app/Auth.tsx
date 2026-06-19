import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { RefreshCw, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/linkeco-logo.png";

const emailSchema = z.string().email("Email invalide");
const passwordSchema = z.string().min(6, "Minimum 6 caractères");

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signIn, signUp } = useAuth();
  const { roles, loading: roleLoading, addRole } = useUserRole();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intendedRole = location.state?.intendedRole;
  const redirectTo = location.state?.redirectTo;

  useEffect(() => {
    if (!loading && !roleLoading && user) {
      if (redirectTo && intendedRole) {
        addRole(intendedRole).then(() => navigate(redirectTo, { replace: true }));
      } else if (roles.includes("provider")) {
        navigate("/app/provider", { replace: true });
      } else if (roles.includes("client") || roles.length > 0) {
        navigate("/app", { replace: true });
      } else {
        navigate("/app/role-select", { replace: true });
      }
    }
  }, [user, loading, roleLoading, roles, navigate, intendedRole, redirectTo, addRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        setIsSubmitting(false);
        return;
      }
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message.includes("Invalid login credentials") ? "Email ou mot de passe incorrect" : "Erreur de connexion");
        setIsSubmitting(false);
      } else {
        toast.success("Connexion réussie!");
      }
    } else {
      if (!fullName.trim()) {
        toast.error("Le nom complet est requis");
        setIsSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message.includes("already registered") ? "Cet email est déjà utilisé" : "Erreur d'inscription");
        setIsSubmitting(false);
      } else {
        toast.success("Compte créé avec succès!");
      }
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-hero-dark safe-area-top safe-area-bottom">
      <div className="absolute inset-0 noise opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] rounded-full bg-primary-glow/25 blur-3xl pointer-events-none" />

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-5 z-10 flex items-center gap-1.5 text-background/70 hover:text-background text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <img src={logo} alt="Link'eco" className="h-14" />
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-accent/80">
            <span className="h-px w-6 bg-accent/50" />
            Plateforme certifiée ONAS
            <span className="h-px w-6 bg-accent/50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="w-full max-w-sm glass-dark rounded-3xl p-7 shadow-float"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-display text-3xl font-bold text-background tracking-tight">
                {isLogin ? "Bon retour." : "Créer un compte."}
              </h1>
              <p className="text-background/60 text-sm mt-1.5 mb-7">
                {isLogin ? "Connectez-vous pour continuer" : "Rejoignez Link'eco en 30 secondes"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-background/80 text-xs uppercase tracking-wider">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ibrahima Diallo"
                      className="bg-white/5 border-white/10 text-background placeholder:text-background/30 h-12 rounded-xl focus-visible:border-accent focus-visible:ring-accent/20"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-background/80 text-xs uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="bg-white/5 border-white/10 text-background placeholder:text-background/30 h-12 rounded-xl focus-visible:border-accent focus-visible:ring-accent/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-background/80 text-xs uppercase tracking-wider">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="bg-white/5 border-white/10 text-background placeholder:text-background/30 h-12 rounded-xl focus-visible:border-accent focus-visible:ring-accent/20"
                  />
                </div>

                <Button
                  type="submit"
                  size="xl"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-gold mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Chargement..." : isLogin ? "Se connecter" : "Créer mon compte"}
                </Button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest text-background/40">ou</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-5 w-full text-sm text-background/70 hover:text-background transition-colors"
              >
                {isLogin ? (
                  <>Pas de compte ? <span className="text-accent font-semibold">S'inscrire</span></>
                ) : (
                  <>Déjà un compte ? <span className="text-accent font-semibold">Se connecter</span></>
                )}
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex items-center gap-1.5 text-xs text-background/40"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Vos données sont chiffrées de bout en bout
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
