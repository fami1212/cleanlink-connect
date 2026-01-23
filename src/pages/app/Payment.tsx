import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/database";

const paymentMethodMap: Record<string, PaymentMethod> = {
  wave: "wave",
  orange: "orange_money",
  free: "free_money",
  cash: "cash",
};

const serviceTypeLabels: Record<string, string> = {
  fosse_septique: "Vidange fosse septique",
  latrines: "Vidange latrines",
  urgence: "Urgence débordement",
  curage: "Curage canalisations",
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrder, updateOrder } = useOrders();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const orderId = location.state?.orderId || currentOrder?.id;
  const priceData = location.state?.price;

  // Use current order data or fallback to location state
  const orderData = currentOrder || null;
  const displayPrice = orderData?.price_min || priceData?.min || 25000;
  const serviceType = orderData?.service_type || "fosse_septique";
  const address = orderData?.address || "Adresse non disponible";

  const paymentMethods = [
    {
      id: "wave",
      name: "Wave",
      icon: "🌊",
      color: "bg-blue-500",
    },
    {
      id: "orange",
      name: "Orange Money",
      icon: "🍊",
      color: "bg-orange-500",
    },
    {
      id: "free",
      name: "Free Money",
      icon: "💚",
      color: "bg-green-500",
    },
    {
      id: "cash",
      name: "Espèces",
      icon: "💵",
      color: "bg-gray-500",
    },
  ];

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("Commande non trouvée");
      return;
    }

    if (!selectedMethod) {
      toast.error("Veuillez choisir un moyen de paiement");
      return;
    }

    if (selectedMethod !== "cash" && !phoneNumber) {
      toast.error("Veuillez entrer votre numéro de téléphone");
      return;
    }

    setIsProcessing(true);

    const { error } = await updateOrder(orderId, {
      payment_method: paymentMethodMap[selectedMethod],
      status: "pending", // Waiting for provider to accept
    });

    setIsProcessing(false);

    if (error) {
      toast.error("Erreur lors du paiement");
      console.error(error);
      return;
    }

    toast.success("Paiement confirmé! Recherche d'un prestataire...");
    navigate("/app/tracking", { state: { orderId } });
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-muted-foreground mb-4">Aucune commande en cours</p>
          <Button variant="hero" onClick={() => navigate("/app")}>
            Retour à l'accueil
          </Button>
        </div>
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
            Paiement
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Order summary */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-display font-semibold text-foreground mb-3">
            Résumé de la commande
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="text-foreground">{serviceTypeLabels[serviceType]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Adresse</span>
              <span className="text-foreground text-right max-w-[60%] truncate">{address}</span>
            </div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total estimé</span>
              <span className="font-display font-bold text-xl text-primary">
                {displayPrice.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <h2 className="font-display font-semibold text-foreground mb-3">
            Moyen de paiement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                {selectedMethod === method.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="text-2xl mb-2">{method.icon}</div>
                <p className="font-medium text-foreground text-sm">
                  {method.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Money info */}
        {selectedMethod && selectedMethod !== "cash" && (
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">
                Numéro de téléphone
              </span>
            </div>
            <input
              type="tel"
              placeholder="+221 77 XXX XX XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
          </div>
        )}

        {/* Eco badge */}
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-2xl">🌱</span>
          <div>
            <p className="font-medium text-foreground text-sm">Éco ONAS</p>
            <p className="text-xs text-muted-foreground">
              Déversement dans un site agréé certifié
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 bg-card border-t border-border safe-area-bottom">
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={!selectedMethod || isProcessing}
          onClick={handlePayment}
        >
          {isProcessing ? "Traitement..." : "Confirmer le paiement"}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
