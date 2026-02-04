import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Truck, 
  Building2, 
  FileCheck, 
  MapPin, 
  Settings,
  ChevronRight,
  Shield,
  LogOut,
  Camera,
  Loader2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useMyProvider } from "@/hooks/useProviders";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";
import { toast } from "@/hooks/use-toast";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { provider, updateProvider, loading } = useMyProvider();
  const { profile, updateProfile } = useProfile();
  const { uploadAvatar, uploading: avatarUploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleOnline = async (online: boolean) => {
    setIsUpdating(true);
    const { error } = await updateProvider({ is_online: online });
    setIsUpdating(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une image", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L'image ne doit pas dépasser 5 Mo", variant: "destructive" });
      return;
    }

    const { url, error } = await uploadAvatar(file);

    if (error) {
      toast({ title: "Erreur", description: "Erreur lors du téléchargement", variant: "destructive" });
      return;
    }

    if (url) {
      await updateProfile({ avatar_url: url });
      toast({ title: "Succès", description: "Photo mise à jour!" });
    }
  };

  const vehicleLabels: Record<string, string> = {
    camion_6000: "Camion citerne (6000L)",
    camion_10000: "Camion citerne (10000L)",
    camion_15000: "Camion citerne (15000L)",
    mini_citerne: "Mini citerne (3000L)",
    tricycle: "Tricycle motorisé",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-card safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/app/provider")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Mon profil prestataire
          </h1>
        </div>
      </div>

      {/* Profile header */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <button
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden"
            >
              {avatarUploading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{initials}</span>
              )}
            </button>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {provider?.company_name || profile?.full_name || "Prestataire"}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {provider?.is_verified ? (
                <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3" />
                  Vérifié
                </span>
              ) : (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Non vérifié
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Online status */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${provider?.is_online ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              <div>
                <p className="font-medium text-foreground">
                  {provider?.is_online ? "En ligne" : "Hors ligne"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {provider?.is_online ? "Vous recevez des missions" : "Vous ne recevez pas de missions"}
                </p>
              </div>
            </div>
            <Switch
              checked={provider?.is_online || false}
              onCheckedChange={handleToggleOnline}
              disabled={isUpdating}
            />
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      <div className="px-4 pb-4">
        <h3 className="font-display font-semibold text-foreground mb-3">
          Véhicule
        </h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Type de véhicule</p>
              <p className="font-medium text-foreground">
                {provider?.vehicle_type
                  ? vehicleLabels[provider.vehicle_type] || provider.vehicle_type
                  : "Non renseigné"}
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-lg">⛽</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Capacité</p>
              <p className="font-medium text-foreground">
                {provider?.capacity_liters
                  ? `${new Intl.NumberFormat("fr-FR").format(provider.capacity_liters)} litres`
                  : "Non renseigné"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company info */}
      {provider?.company_name && (
        <div className="px-4 pb-4">
          <h3 className="font-display font-semibold text-foreground mb-3">
            Entreprise
          </h3>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Nom de l'entreprise</p>
              <p className="font-medium text-foreground">{provider.company_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu items */}
      <div className="px-4 pb-4">
        <h3 className="font-display font-semibold text-foreground mb-3">
          Paramètres
        </h3>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          <button
            onClick={() => navigate("/app/profile/edit")}
            className="w-full p-4 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Modifier mon profil</p>
              <p className="text-sm text-muted-foreground">Informations personnelles</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/app/provider/documents")}
            className="w-full p-4 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Documents</p>
              <p className="text-sm text-muted-foreground">Carte grise, permis</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            className="w-full p-4 flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Zone de travail</p>
              <p className="text-sm text-muted-foreground">Définir ma zone de couverture</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Switch to client mode */}
      <div className="px-4 pb-4">
        <button
          onClick={() => navigate("/app")}
          className="w-full bg-card rounded-xl border border-border p-4 flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Mode client</p>
            <p className="text-sm text-muted-foreground">Basculer vers l'interface client</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Logout */}
      <div className="px-4 pb-8">
        <button
          onClick={handleLogout}
          className="w-full bg-destructive/10 rounded-xl p-4 flex items-center justify-center gap-2 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderProfile;
