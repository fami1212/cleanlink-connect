import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Building2, FileCheck, MapPin, Settings, ChevronRight, LogOut, Camera, Loader2, Star, Zap, Shield } from "lucide-react";
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
    if (error) toast({ title: "Erreur", description: "Impossible de changer le statut", variant: "destructive" });
  };

  const handleLogout = async () => { await signOut(); navigate("/"); };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Erreur", description: "Veuillez sélectionner une image", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Erreur", description: "Max 5 Mo", variant: "destructive" }); return; }
    const { url, error } = await uploadAvatar(file);
    if (error) { toast({ title: "Erreur", description: "Erreur upload", variant: "destructive" }); return; }
    if (url) { await updateProfile({ avatar_url: url }); toast({ title: "Succès", description: "Photo mise à jour!" }); }
  };

  const vehicleLabels: Record<string, string> = {
    camion_6000: "Camion citerne (6000L)", camion_10000: "Camion citerne (10000L)", camion_15000: "Camion citerne (15000L)", mini_citerne: "Mini citerne (3000L)", tricycle: "Tricycle motorisé",
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><motion.div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /></div>;
  }

  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase() || user?.email?.[0]?.toUpperCase() || "P";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate("/app/provider")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-display text-lg font-bold text-white">Mon profil</h1>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <button onClick={handleAvatarClick} disabled={avatarUploading} className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg">
                {avatarUploading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-primary">{initials}</span>}
              </button>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow"><Camera className="w-3 h-3 text-muted-foreground" /></div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">{provider?.company_name || profile?.full_name || "Prestataire"}</h2>
              <p className="text-sm text-white/60">{user?.email}</p>
              {provider?.is_verified && (
                <span className="inline-flex items-center gap-1 text-[10px] text-accent bg-accent/20 px-2 py-0.5 rounded-full font-medium mt-1">
                  <Shield className="w-3 h-3" /> Vérifié
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: Zap, value: String(stats.totalMissions), label: "Missions" },
              { icon: Star, value: stats.averageRating > 0 ? String(stats.averageRating) : "-", label: "Note" },
              { icon: null, value: formatPrice(stats.totalEarnings).replace(" FCFA", ""), label: "FCFA" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="font-display font-bold text-white text-base">{s.value}</p>
                <p className="text-[10px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 -mt-3 relative z-10">
        {/* Online toggle */}
        <div className={`rounded-2xl p-4 border transition-all ${provider?.is_online ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${provider?.is_online ? "bg-primary" : "bg-muted-foreground"}`} />
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{provider?.is_online ? "En ligne" : "Hors ligne"}</p>
                <p className="text-xs text-muted-foreground">{provider?.is_online ? "Vous recevez des missions" : "Activez pour recevoir"}</p>
              </div>
            </div>
            <Switch checked={provider?.is_online || false} onCheckedChange={handleToggleOnline} disabled={isUpdating} />
          </div>
        </div>

        {/* Vehicle */}
        <div>
          <h3 className="font-display font-bold text-foreground text-sm mb-2 px-1">Véhicule</h3>
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/8 rounded-lg flex items-center justify-center"><Truck className="w-4 h-4 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">Type</p><p className="text-sm font-medium text-foreground">{provider?.vehicle_type ? vehicleLabels[provider.vehicle_type] || provider.vehicle_type : "Non renseigné"}</p></div>
            </div>
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center"><span className="text-sm">⛽</span></div>
              <div><p className="text-xs text-muted-foreground">Capacité</p><p className="text-sm font-medium text-foreground">{provider?.capacity_liters ? `${new Intl.NumberFormat("fr-FR").format(provider.capacity_liters)} L` : "Non renseigné"}</p></div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {[
            { icon: Settings, label: "Modifier mon profil", path: "/app/profile/edit" },
            { icon: FileCheck, label: "Documents", path: "/app/provider/documents" },
            { icon: MapPin, label: "Zone de travail", path: null as string | null },
          ].map((item) => (
            <button key={item.label} onClick={() => item.path && navigate(item.path)} className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors">
              <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center"><item.icon className="w-4 h-4 text-muted-foreground" /></div>
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Client mode */}
        <button onClick={() => navigate("/app")} className="w-full bg-card rounded-2xl border border-border p-3.5 flex items-center gap-3 hover:shadow-card transition-shadow">
          <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center"><span className="text-sm">👤</span></div>
          <div className="flex-1 text-left"><p className="text-sm font-medium text-foreground">Mode client</p></div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/8 rounded-2xl text-destructive font-medium text-sm hover:bg-destructive/15 transition-colors">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderProfile;
