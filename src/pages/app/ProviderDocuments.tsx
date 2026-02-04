import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck, Upload, Check, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyProvider } from "@/hooks/useProviders";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import ProviderBottomNav from "@/components/app/ProviderBottomNav";
import { toast } from "@/hooks/use-toast";

const ProviderDocuments = () => {
  const navigate = useNavigate();
  const { provider, updateProvider, loading } = useMyProvider();
  const { uploadDocument, uploading } = useDocumentUpload();
  
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const registrationInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadingType, setUploadingType] = useState<"license" | "vehicle_registration" | null>(null);

  const handleFileSelect = async (
    file: File | undefined, 
    type: "license" | "vehicle_registration"
  ) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier invalide",
        description: "Seuls les formats JPG, PNG, WebP et PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "Le fichier ne doit pas dépasser 5 Mo",
        variant: "destructive",
      });
      return;
    }

    setUploadingType(type);

    const { url, error } = await uploadDocument(file, type);

    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive",
      });
      setUploadingType(null);
      return;
    }

    if (url) {
      const updateData = type === "license" 
        ? { license_url: url }
        : { vehicle_registration_url: url };
      
      const { error: updateError } = await updateProvider(updateData);

      if (updateError) {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder le document",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Document téléchargé",
          description: type === "license" 
            ? "Votre permis a été enregistré"
            : "Votre carte grise a été enregistrée",
        });
      }
    }

    setUploadingType(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const documents = [
    {
      id: "license" as const,
      title: "Permis de conduire",
      description: "Permis valide pour conduire votre véhicule",
      icon: "🪪",
      url: provider?.license_url,
      inputRef: licenseInputRef,
    },
    {
      id: "vehicle_registration" as const,
      title: "Carte grise",
      description: "Carte grise du véhicule utilisé",
      icon: "📄",
      url: provider?.vehicle_registration_url,
      inputRef: registrationInputRef,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="bg-card safe-area-top">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={() => navigate("/app/provider/profile")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            Mes documents
          </h1>
        </div>
      </div>

      {/* Info banner */}
      <div className="px-4 py-4">
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">
                Documents requis
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Téléchargez vos documents pour vérification. Formats acceptés : JPG, PNG, PDF (max 5 Mo)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div className="px-4 space-y-3">
        {documents.map((doc) => {
          const isUploading = uploadingType === doc.id;
          const hasDocument = !!doc.url;

          return (
            <div
              key={doc.id}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">{doc.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{doc.title}</h3>
                    {hasDocument && (
                      <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Téléchargé
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <input
                      ref={doc.inputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleFileSelect(e.target.files?.[0], doc.id)}
                      className="hidden"
                    />
                    <Button
                      variant={hasDocument ? "outline" : "default"}
                      size="sm"
                      onClick={() => doc.inputRef.current?.click()}
                      disabled={uploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Téléchargement...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {hasDocument ? "Remplacer" : "Télécharger"}
                        </>
                      )}
                    </Button>
                    
                    {hasDocument && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification status */}
      <div className="px-4 py-6">
        <div className={`rounded-xl p-4 border ${
          provider?.is_verified 
            ? "bg-primary/5 border-primary/20" 
            : "bg-muted/50 border-border"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              provider?.is_verified ? "bg-primary/20" : "bg-muted"
            }`}>
              {provider?.is_verified ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <FileCheck className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className={`font-medium ${
                provider?.is_verified ? "text-primary" : "text-foreground"
              }`}>
                {provider?.is_verified ? "Profil vérifié" : "En attente de vérification"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {provider?.is_verified 
                  ? "Vos documents ont été validés" 
                  : "Nos équipes examineront vos documents sous 24-48h"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProviderBottomNav />
    </div>
  );
};

export default ProviderDocuments;
