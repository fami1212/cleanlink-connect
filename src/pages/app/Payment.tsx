import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone, CreditCard, Banknote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

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
              <span className="text-foreground">Vidange fosse septique</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Adresse</span>
              <span className="text-foreground">Rue Meya, Dakar</span>
            </div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-display font-bold text-xl text-primary">
                25 000 FCFA
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
          disabled={!selectedMethod}
          onClick={() => navigate("/app/tracking")}
        >
          Confirmer le paiement
        </Button>
      </div>
    </div>
  );
};

export default Payment;
