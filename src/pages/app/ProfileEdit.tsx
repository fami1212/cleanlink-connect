import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { toast } from "sonner";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { uploadAvatar, uploading: avatarUploading } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dakar");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync form state with profile data when it loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.user_metadata?.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setCity(profile.city || "Dakar");
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    const { url, error } = await uploadAvatar(file);

    if (error) {
      toast.error("Erreur lors du téléchargement");
      return;
    }

    if (url) {
      setAvatarUrl(url);
      // Update profile with new avatar URL
      await updateProfile({ avatar_url: url });
      toast.success("Photo mise à jour!");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      address,
      city,
      avatar_url: avatarUrl,
    });

    setIsSaving(false);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Profil mis à jour!");
      navigate(-1);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            Informations personnelles
          </h1>
        </div>
      </div>

      {/* Avatar section */}
      <div className="p-6 flex flex-col items-center">
        <div className="relative">
          <button
            onClick={handleAvatarClick}
            disabled={avatarUploading}
            className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {avatarUploading ? (
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
            ) : avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary-foreground" />
            )}
          </button>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Appuyez pour changer la photo
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 space-y-4">
        <div>
          <Label htmlFor="fullName">Nom complet</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ibrahima Diallo"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+221 77 XXX XX XX"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rue Meya, Médina"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Dakar"
            className="mt-1"
          />
        </div>

        <div className="pt-4 text-sm text-muted-foreground">
          <p>Email: {user?.email}</p>
          <p className="mt-1 text-xs">L'email ne peut pas être modifié</p>
        </div>
      </div>

      {/* Save button */}
      <div className="p-4 bg-card border-t border-border safe-area-bottom">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={handleSave}
          disabled={isSaving || avatarUploading}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEdit;
