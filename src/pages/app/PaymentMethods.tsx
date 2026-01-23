import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>("wave");

  // Mock saved payment methods
  const [savedMethods] = useState([
    { id: "wave", type: "wave", label: "Wave", phone: "+221 77 123 45 67", icon: "🌊" },
    { id: "orange", type: "orange_money", label: "Orange Money", phone: "+221 76 123 45 67", icon: "🍊" },
  ]);

  const handleSetDefault = (id: string) => {
    setSelectedMethod(id);
    toast.success("Méthode par défaut mise à jour");
  };

  const handleDelete = (id: string) => {
    toast.success("Méthode de paiement supprimée");
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
            Moyens de paiement
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Gérez vos moyens de paiement Mobile Money
        </p>

        {savedMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-card border rounded-xl p-4 ${
              selectedMethod === method.id ? "border-primary" : "border-border"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                <span className="text-2xl">{method.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{method.label}</h3>
                <p className="text-sm text-muted-foreground">{method.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedMethod === method.id && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Par défaut
                  </span>
                )}
                <button
                  onClick={() => handleDelete(method.id)}
                  className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            
            {selectedMethod !== method.id && (
              <button
                onClick={() => handleSetDefault(method.id)}
                className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Définir par défaut
              </button>
            )}
          </div>
        ))}

        {/* Add new method */}
        <button className="w-full bg-card border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <p className="font-medium text-foreground">Ajouter un moyen de paiement</p>
          <p className="text-sm text-muted-foreground">Wave, Orange Money, Free Money</p>
        </button>

        {/* Info */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <div>
              <p className="font-medium text-foreground text-sm">Paiements sécurisés</p>
              <p className="text-xs text-muted-foreground mt-1">
                Vos informations sont cryptées et sécurisées. Nous ne stockons jamais vos codes PIN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
