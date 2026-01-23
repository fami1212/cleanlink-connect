import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { RefreshCw } from "lucide-react";
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

  // Get intended role and redirect from location state
  const intendedRole = location.state?.intendedRole;
  const redirectTo = location.state?.redirectTo;

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (!loading && !roleLoading && user) {
      // User is logged in, determine where to redirect
      if (redirectTo && intendedRole) {
        // Add the intended role and redirect
        addRole(intendedRole).then(() => {
          navigate(redirectTo, { replace: true });
        });
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
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect");
        } else {
          toast.error("Erreur de connexion");
        }
        setIsSubmitting(false);
      } else {
        toast.success("Connexion réussie!");
        // Redirect will happen via useEffect when user state updates
      }
    } else {
      if (!fullName.trim()) {
        toast.error("Le nom complet est requis");
        setIsSubmitting(false);
        return;
      }

      const { error } = await signUp(email, password, fullName);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Cet email est déjà utilisé");
        } else {
          toast.error("Erreur d'inscription");
        }
        setIsSubmitting(false);
      } else {
        toast.success("Compte créé avec succès!");
        // Redirect will happen via useEffect when user state updates
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col safe-area-top safe-area-bottom">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <img src={logo} alt="Link'eco" className="h-16 mb-8" />
        
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
            {isLogin ? "Connexion" : "Inscription"}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin 
              ? "Connectez-vous pour commander" 
              : "Créez votre compte Link'eco"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ibrahima Diallo"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Chargement..." 
                : isLogin 
                  ? "Se connecter" 
                  : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin 
                ? "Pas de compte ? S'inscrire" 
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>

      {/* Back to landing */}
      <div className="p-6 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Retour au site
        </button>
      </div>
    </div>
  );
};

export default Auth;
