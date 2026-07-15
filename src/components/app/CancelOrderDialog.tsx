import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const REASONS = [
  { value: "changement_avis", label: "Changement d'avis" },
  { value: "delai_trop_long", label: "Délai d'attente trop long" },
  { value: "prix_eleve", label: "Prix trop élevé" },
  { value: "prestataire_indisponible", label: "Prestataire indisponible" },
  { value: "urgence_resolue", label: "Urgence résolue autrement" },
  { value: "autre", label: "Autre" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, details: string) => Promise<void> | void;
  loading?: boolean;
}

const CancelOrderDialog = ({ open, onClose, onConfirm, loading }: Props) => {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <h2 className="font-display font-semibold">Annuler la commande</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Aidez-nous à améliorer le service en précisant le motif d'annulation.
          </p>

          <div className="space-y-1.5">
            {REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                  reason === r.value
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Détails (optionnel)"
            className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary resize-none h-20"
          />
        </div>

        <div className="flex gap-2 p-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Retour
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={!reason || loading}
            onClick={() => onConfirm(reason, details)}
          >
            {loading ? "Annulation..." : "Confirmer l'annulation"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderDialog;
