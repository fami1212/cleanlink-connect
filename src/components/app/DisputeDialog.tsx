import { useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "non_service", label: "Service non effectué" },
  { value: "service_incomplet", label: "Service incomplet" },
  { value: "prix", label: "Litige sur le prix" },
  { value: "comportement", label: "Comportement du prestataire" },
  { value: "securite", label: "Problème de sécurité / déversement" },
  { value: "autre", label: "Autre" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: string;
  clientId: string;
  providerId: string | null;
  paidAmount?: number | null;
  onCreated?: () => void;
}

const DisputeDialog = ({ open, onClose, orderId, clientId, providerId, paidAmount, onCreated }: Props) => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [disputedAmount, setDisputedAmount] = useState<string>(paidAmount ? String(paidAmount) : "");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!category || description.length < 10) {
      toast.error("Merci de choisir une catégorie et de décrire le problème (10 caractères min)");
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any).from("disputes").insert({
      order_id: orderId,
      client_id: clientId,
      provider_id: providerId,
      category,
      description,
      disputed_amount: disputedAmount ? Number(disputedAmount) : null,
    });
    setLoading(false);
    if (error) {
      toast.error("Impossible d'ouvrir le litige");
      console.error(error);
      return;
    }
    toast.success("Litige ouvert. Notre équipe vous répond sous 24 h.");
    onCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-display font-semibold">Signaler un litige</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Catégorie</p>
            <div className="space-y-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    category === c.value
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Description détaillée</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce qui s'est passé..."
              className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary resize-none h-28"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Montant contesté (FCFA)</p>
            <input
              type="number"
              value={disputedAmount}
              onChange={(e) => setDisputedAmount(e.target.value)}
              placeholder="0"
              className="w-full p-2.5 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-border sticky bottom-0 bg-card">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="hero" className="flex-1" onClick={submit} disabled={loading}>
            {loading ? "Envoi..." : "Ouvrir le litige"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DisputeDialog;
