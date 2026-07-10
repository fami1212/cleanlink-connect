import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown, Sparkles, Camera, Loader2, AlertTriangle, WifiOff, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Map from "@/components/app/Map";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";
import { ServiceType } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { logAiEvent } from "@/lib/aiUsage";

const serviceTypeMap: Record<string, ServiceType> = {
  "Vidange fosse septique": "fosse_septique",
  "Vidange latrines": "latrines",
  "Urgence débordement": "urgence",
  "Curage canalisations": "curage",
};

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  
  const initialService = location.state?.service || "Vidange fosse septique";
  
  const [selectedService, setSelectedService] = useState(initialService);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showServiceSelect, setShowServiceSelect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<null | { price_min: number; price_max: number; explanation: string; tips: string[]; eta_min: number }>(null);
  const [estimating, setEstimating] = useState(false);
  const [photoAnalysis, setPhotoAnalysis] = useState<null | { fill_level: string; urgency: string; observations: string; recommended_service: string; safety_warnings: string[] }>(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aiError, setAiError] = useState<null | { source: "estimate" | "photo"; kind: "rate_limited" | "no_credits" | "network" | "generic"; message: string }>(null);
  const [degradedMode, setDegradedMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const services = [
    "Vidange fosse septique",
    "Vidange latrines",
    "Urgence débordement",
    "Curage canalisations",
  ];

  const priceRange = {
    "Vidange fosse septique": { min: 25000, max: 30000 },
    "Vidange latrines": { min: 15000, max: 20000 },
    "Urgence débordement": { min: 35000, max: 50000 },
    "Curage canalisations": { min: 20000, max: 30000 },
  };

  const currentPrice = aiEstimate
    ? { min: aiEstimate.price_min, max: aiEstimate.price_max }
    : priceRange[selectedService as keyof typeof priceRange] || { min: 25000, max: 30000 };

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(addr.split(",").slice(0, 3).join(","));
  };

  const runEstimation = async () => {
    setEstimating(true);
    setAiEstimate(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-estimate", {
        body: {
          service_type: serviceTypeMap[selectedService],
          address,
          urgency: selectedService === "Urgence débordement",
          hour: new Date().getHours(),
        },
      });
      if (error) throw error;
      setAiEstimate(data);
      toast.success("Estimation IA prête ✨");
    } catch (e: any) {
      toast.error("Estimation IA indisponible");
    } finally {
      setEstimating(false);
    }
  };

  const handlePhoto = async (file: File) => {
    setAnalyzingPhoto(true);
    setPhotoAnalysis(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPhotoPreview(dataUrl);
      try {
        const { data, error } = await supabase.functions.invoke("ai-photo-analysis", {
          body: { image_url: dataUrl, mime_type: file.type },
        });
        if (error) throw error;
        setPhotoAnalysis(data);
        // Auto-adjust service
        const map: Record<string, string> = {
          fosse_septique: "Vidange fosse septique",
          latrines: "Vidange latrines",
          urgence: "Urgence débordement",
          curage: "Curage canalisations",
        };
        if (data.recommended_service && map[data.recommended_service]) {
          setSelectedService(map[data.recommended_service]);
        }
        toast.success("Photo analysée 📸");
      } catch (e) {
        toast.error("Analyse photo indisponible");
      } finally {
        setAnalyzingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      navigate("/app/auth");
      return;
    }

    if (!address || !latitude || !longitude) {
      toast.error("Veuillez sélectionner une adresse sur la carte");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createOrder({
      service_type: serviceTypeMap[selectedService],
      address,
      latitude,
      longitude,
      price_min: currentPrice.min,
      price_max: currentPrice.max,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la création de la commande");
      console.error(error);
      return;
    }

    toast.success("Commande créée!");
    navigate("/app/payment", { state: { orderId: data?.id, price: currentPrice } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Glass header */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/40 safe-area-top">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center ring-1 ring-border/60 hover:ring-accent/40 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">Étape 1 / 2</p>
            <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
              Nouvelle commande
            </h1>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative">
        <Map
          onLocationSelect={handleLocationSelect}
          initialLat={14.6937}
          initialLng={-17.4441}
          className="h-64"
          interactive={true}
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 -mt-6 relative z-10">
        {/* Address display */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">Adresse sélectionnée</p>
          </div>
          <p className="font-medium text-foreground text-sm">
            {address || "Cliquez sur la carte ou utilisez la géolocalisation"}
          </p>
        </div>

        {/* Service selector */}
        <div>
          <label className="text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-2 block px-1">
            Type de service
          </label>
          <button
            onClick={() => setShowServiceSelect(!showServiceSelect)}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-accent/40 transition-colors"
          >
            <span className="font-display font-semibold text-foreground">{selectedService}</span>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showServiceSelect ? "rotate-180" : ""}`} />
          </button>
          
          {showServiceSelect && (
            <div className="mt-2 bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-fade-in">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => {
                    setSelectedService(service);
                    setShowServiceSelect(false);
                  }}
                  className={`w-full p-4 text-left transition-colors ${
                    selectedService === service
                      ? "bg-primary/10 text-primary font-semibold border-l-2 border-accent"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI photo analysis */}
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Analyse IA par photo</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-accent font-bold">Nouveau</span>
          </div>
          <p className="text-xs text-muted-foreground">Prends une photo de la fosse — Léa estime le volume, l'urgence et le service adapté.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])}
          />
          <Button
            variant="outline"
            className="w-full border-accent/40 hover:bg-accent/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzingPhoto}
          >
            {analyzingPhoto ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyse...</> : <><Camera className="w-4 h-4 mr-2" /> Prendre / choisir une photo</>}
          </Button>
          {photoPreview && (
            <img src={photoPreview} alt="fosse" className="w-full h-32 object-cover rounded-xl" />
          )}
          {photoAnalysis && (
            <div className="text-xs space-y-2 bg-card rounded-xl p-3 border border-border">
              <p className="text-foreground">{photoAnalysis.observations}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">Niveau: {photoAnalysis.fill_level}</span>
                <span className="px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">Urgence: {photoAnalysis.urgency}</span>
              </div>
              {photoAnalysis.safety_warnings?.length > 0 && (
                <div className="flex gap-2 items-start text-destructive">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{photoAnalysis.safety_warnings.join(" · ")}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price estimate */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-hero-dark text-white noise">
          <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/60 font-semibold">
                {aiEstimate ? "Estimation IA" : "Prix estimé"}
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-accent font-semibold">À partir de</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-aurora">
                {currentPrice.min.toLocaleString()}
              </span>
              <span className="text-white/50 text-sm">~ {currentPrice.max.toLocaleString()} FCFA</span>
            </div>
            {aiEstimate?.explanation && (
              <p className="text-xs text-white/70 mt-2">{aiEstimate.explanation}</p>
            )}
            {aiEstimate?.tips?.length ? (
              <ul className="mt-2 space-y-1">
                {aiEstimate.tips.map((t, i) => (
                  <li key={i} className="text-xs text-white/60">• {t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/50 mt-2 font-light">Prestataires certifiés ONAS · Traçabilité incluse</p>
            )}
            <button
              onClick={runEstimation}
              disabled={estimating}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              {estimating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {estimating ? "Calcul IA..." : aiEstimate ? "Recalculer avec l'IA" : "Estimer avec l'IA"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 glass-strong border-t border-border/40 safe-area-bottom">
        <Button
          size="xl"
          className="w-full bg-gradient-gold text-accent-foreground hover:opacity-95 font-semibold h-14 rounded-2xl text-base shadow-gold"
          onClick={handleSubmit}
          disabled={isSubmitting || !address}
        >
          {isSubmitting ? "Création..." : "Confirmer la commande"}
        </Button>
      </div>
    </div>
  );
};

export default Order;
