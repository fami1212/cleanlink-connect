import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Building2, FileCheck, Upload, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useMyProvider } from "@/hooks/useProviders";
import { useUserRole } from "@/hooks/useUserRole";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { toast } from "@/hooks/use-toast";

const ProviderRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProvider } = useMyProvider();
  const { addRole } = useUserRole();
  const { uploadDocument, uploading } = useDocumentUpload();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const licenseInputRef = useRef<HTMLInputElement>(null);
  const registrationInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    vehicleType: "",
    capacityLiters: "",
    phone: "",
  });

  const [documents, setDocuments] = useState({
    license: null as File | null,
    licenseUrl: null as string | null,
    vehicleRegistration: null as File | null,
    vehicleRegistrationUrl: null as string | null,
  });

  const handleLicenseSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Le fichier ne doit pas dépasser 5 Mo", variant: "destructive" });
      return;
    }

    setDocuments(prev => ({ ...prev, license: file }));

    const { url, error } = await uploadDocument(file, "license");
    if (error) {
      toast({ title: "Erreur", description: "Échec du téléchargement", variant: "destructive" });
      setDocuments(prev => ({ ...prev, license: null }));
    } else if (url) {
      setDocuments(prev => ({ ...prev, licenseUrl: url }));
      toast({ title: "Succès", description: "Permis téléchargé" });
    }
  };

  const handleRegistrationSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Le fichier ne doit pas dépasser 5 Mo", variant: "destructive" });
      return;
    }

    setDocuments(prev => ({ ...prev, vehicleRegistration: file }));

    const { url, error } = await uploadDocument(file, "vehicle_registration");
    if (error) {
      toast({ title: "Erreur", description: "Échec du téléchargement", variant: "destructive" });
      setDocuments(prev => ({ ...prev, vehicleRegistration: null }));
    } else if (url) {
      setDocuments(prev => ({ ...prev, vehicleRegistrationUrl: url }));
      toast({ title: "Succès", description: "Carte grise téléchargée" });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Create provider profile FIRST (with required documents) so the
    // role-insert policy can verify the user has uploaded documents.
    const { error } = await createProvider({
      company_name: formData.companyName || null,
      vehicle_type: formData.vehicleType,
      capacity_liters: parseInt(formData.capacityLiters) || null,
      is_online: false,
      is_verified: false,
      license_url: documents.licenseUrl,
      vehicle_registration_url: documents.vehicleRegistrationUrl,
    });

    // Then add provider role (RLS verifies provider row with documents exists)
    if (!error) {
      const { error: roleError } = await addRole("provider");
      if (roleError) {
        console.error("Error adding role:", roleError);
      }
    }

    setLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer votre profil prestataire",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inscription réussie! 🎉",
        description: "Votre profil prestataire a été créé",
      });
      navigate("/app/provider");
    }
  };

  const vehicleTypes = [
    { value: "camion_6000", label: "Camion citerne (6000L)" },
    { value: "camion_10000", label: "Camion citerne (10000L)" },
    { value: "camion_15000", label: "Camion citerne (15000L)" },
    { value: "mini_citerne", label: "Mini citerne (3000L)" },
    { value: "tricycle", label: "Tricycle motorisé" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card safe-area-top sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-lg font-semibold text-foreground">
              Devenir prestataire
            </h1>
            <p className="text-sm text-muted-foreground">
              Étape {step} sur 3
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 pb-24">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Informations entreprise
              </h2>
              <p className="text-muted-foreground">
                Commençons par les informations de votre entreprise
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nom de l'entreprise (optionnel)</Label>
                <Input
                  id="companyName"
                  placeholder="Ex: Sénégal Assainissement SARL"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="77 000 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={() => setStep(2)}
            >
              Continuer
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Votre véhicule
              </h2>
              <p className="text-muted-foreground">
                Renseignez les informations de votre véhicule
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Type de véhicule</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="capacity">Capacité en litres</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="6000"
                  value={formData.capacityLiters}
                  onChange={(e) => setFormData({ ...formData, capacityLiters: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Retour
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={!formData.vehicleType}
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Documents (optionnel)
              </h2>
              <p className="text-muted-foreground">
                Ajoutez vos documents pour être vérifié plus rapidement
              </p>
            </div>

            <div className="space-y-4">
              {/* Vehicle Registration Upload */}
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  documents.vehicleRegistration 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => registrationInputRef.current?.click()}
              >
                {uploading && !documents.vehicleRegistrationUrl ? (
                  <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                ) : documents.vehicleRegistration ? (
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                )}
                <p className="font-medium text-foreground mb-1">
                  Carte grise du véhicule
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {documents.vehicleRegistration 
                    ? documents.vehicleRegistration.name 
                    : "JPG, PNG ou PDF (max 5 Mo)"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  disabled={uploading}
                >
                  {documents.vehicleRegistration ? "Changer" : "Choisir un fichier"}
                </Button>
                <input
                  ref={registrationInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleRegistrationSelect}
                  className="hidden"
                />
              </div>

              {/* License Upload */}
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  documents.license 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => licenseInputRef.current?.click()}
              >
                {uploading && !documents.licenseUrl ? (
                  <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                ) : documents.license ? (
                  <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                )}
                <p className="font-medium text-foreground mb-1">
                  Permis de conduire
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {documents.license 
                    ? documents.license.name 
                    : "JPG, PNG ou PDF (max 5 Mo)"}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  disabled={uploading}
                >
                  {documents.license ? "Changer" : "Choisir un fichier"}
                </Button>
                <input
                  ref={licenseInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleLicenseSelect}
                  className="hidden"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Vous pourrez ajouter ces documents plus tard depuis votre profil
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                Retour
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleSubmit}
                disabled={loading || uploading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Création...</span>
                  </div>
                ) : (
                  "Créer mon profil"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderRegister;
