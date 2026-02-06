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
  Loader2,
  Star,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useMyProvider } from "@/hooks/useProviders";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { useProviderStats } from "@/hooks/useProviderStats";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";
import { toast } from "@/hooks/use-toast";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { provider, updateProvider, loading } = useMyProvider();
  const { profile, updateProfile } = useProfile();
  const { uploadAvatar, uploading: avatarUploading } = useAvatarUpload();
  const { stats, formatPrice } = useProviderStats();
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
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-24">
      {/* Header */}
      <motion.div 
        className="bg-card safe-area-top shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3 p-4">
          <motion.button
            onClick={() => navigate("/app/provider")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="font-display text-lg font-bold text-foreground">
            Mon profil prestataire
          </h1>
        </div>
      </motion.div>

      {/* Profile header */}
      <motion.div 
        className="px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <motion.button
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {avatarUploading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{initials}</span>
              )}
            </motion.button>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-card border-2 border-background rounded-xl flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </motion.div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">
              {provider?.company_name || profile?.full_name || "Prestataire"}
            </h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {provider?.is_verified ? (
                <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
                  <Shield className="w-3 h-3" />
                  Vérifié
                </span>
              ) : (
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  Non vérifié
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div 
          className="flex gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-lg text-foreground">{stats.totalMissions}</span>
            </div>
            <p className="text-xs text-muted-foreground">Missions</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-accent" />
              <span className="font-display font-bold text-lg text-foreground">{stats.averageRating || "-"}</span>
            </div>
            <p className="text-xs text-muted-foreground">Note</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-4 border border-border text-center">
            <span className="font-display font-bold text-lg text-foreground block truncate">{formatPrice(stats.totalEarnings).replace(" FCFA", "")}</span>
            <p className="text-xs text-muted-foreground">FCFA gagnés</p>
          </div>
        </motion.div>

        {/* Online status */}
        <motion.div 
          className={`rounded-2xl p-4 border transition-all ${
            provider?.is_online 
              ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20" 
              : "bg-card border-border"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-4 h-4 rounded-full ${provider?.is_online ? "bg-primary" : "bg-muted-foreground"}`}
                animate={provider?.is_online ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div>
                <p className="font-medium text-foreground">
                  {provider?.is_online ? "En ligne" : "Hors ligne"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {provider?.is_online ? "Vous recevez des missions" : "Activez pour recevoir des missions"}
                </p>
              </div>
            </div>
            <Switch
              checked={provider?.is_online || false}
              onCheckedChange={handleToggleOnline}
              disabled={isUpdating}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Vehicle info */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display font-bold text-foreground mb-3">
          Véhicule
        </h3>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
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
            <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
              <span className="text-xl">⛽</span>
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
      </motion.div>

      {/* Company info */}
      {provider?.company_name && (
        <motion.div 
          className="px-4 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="font-display font-bold text-foreground mb-3">
            Entreprise
          </h3>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Nom de l'entreprise</p>
              <p className="font-medium text-foreground">{provider.company_name}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Menu items */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-display font-bold text-foreground mb-3">
          Paramètres
        </h3>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {[
            { icon: Settings, label: "Modifier mon profil", desc: "Informations personnelles", path: "/app/profile/edit" },
            { icon: FileCheck, label: "Documents", desc: "Carte grise, permis", path: "/app/provider/documents" },
            { icon: MapPin, label: "Zone de travail", desc: "Définir ma zone de couverture", path: null },
          ].map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
              whileHover={{ x: 4 }}
            >
              <div className="w-11 h-11 bg-muted rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Switch to client mode */}
      <motion.div 
        className="px-4 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <motion.button
          onClick={() => navigate("/app")}
          className="w-full bg-card rounded-2xl border border-border p-4 flex items-center gap-3 text-left hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Mode client</p>
            <p className="text-sm text-muted-foreground">Basculer vers l'interface client</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      {/* Logout */}
      <motion.div 
        className="px-4 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleLogout}
          className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center justify-center gap-2 text-destructive font-medium hover:bg-destructive/20 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </motion.button>
      </motion.div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderProfile;
