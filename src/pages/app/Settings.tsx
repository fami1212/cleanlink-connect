import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Globe, Shield, Trash2, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");

  const handleDeleteAccount = () => {
    toast.error("Cette fonctionnalité sera bientôt disponible");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/app/auth");
  };

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
            Paramètres
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Appearance */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
            Apparence
          </h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Mode sombre</h4>
                <p className="text-sm text-muted-foreground">Thème foncé pour l'application</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </div>

        {/* Language */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
            Langue
          </h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-foreground">Langue de l'application</h4>
                <p className="text-sm text-muted-foreground">Français</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
            Confidentialité
          </h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-foreground">Politique de confidentialité</h4>
                <p className="text-sm text-muted-foreground">Comment nous protégeons vos données</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-foreground">Conditions d'utilisation</h4>
                <p className="text-sm text-muted-foreground">Nos termes et conditions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <h3 className="text-sm font-medium text-destructive mb-2 px-1">
            Zone de danger
          </h3>
          <div className="bg-card border border-destructive/30 rounded-xl overflow-hidden">
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center gap-4 p-4"
            >
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-destructive">Supprimer mon compte</h4>
                <p className="text-sm text-muted-foreground">Cette action est irréversible</p>
              </div>
              <ChevronRight className="w-5 h-5 text-destructive" />
            </button>
          </div>
        </div>

        {/* Version */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Link'eco v1.0.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © 2024 Link'eco - Dakar, Sénégal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
