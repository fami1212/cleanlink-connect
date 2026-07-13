import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, FileText, Loader2, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const AdminProviders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    let q = (supabase.from("providers") as any).select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("verification_status", filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setProviders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const decide = async (id: string, status: "approved" | "rejected") => {
    const { error } = await (supabase.from("providers") as any)
      .update({
        verification_status: status,
        verification_notes: notes[id] ?? null,
        verified_by: user?.id ?? null,
      })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(status === "approved" ? "Prestataire approuvé" : "Prestataire refusé");
      load();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="bg-card border-b border-border safe-area-top sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate("/app/admin")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-semibold">Validation prestataires</h1>
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "pending" ? "En attente" : f === "approved" ? "Approuvés" : f === "rejected" ? "Refusés" : "Tous"}
            </button>
          ))}
        </div>
      </header>

      <main className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Truck className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Aucun prestataire {filter !== "all" ? `« ${filter} »` : ""}.</p>
          </div>
        ) : (
          providers.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.company_name || "Sans nom"}</h3>
                  <p className="text-xs text-muted-foreground">Véhicule : {p.vehicle_type || "—"} · Capacité : {p.capacity_liters ?? "—"} L</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  p.verification_status === "approved" ? "bg-emerald-100 text-emerald-700" :
                  p.verification_status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{p.verification_status}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {p.license_url && (
                  <a href={p.license_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-lg">
                    <FileText className="w-3 h-3" /> Licence
                  </a>
                )}
                {p.vehicle_registration_url && (
                  <a href={p.vehicle_registration_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-lg">
                    <FileText className="w-3 h-3" /> Carte grise
                  </a>
                )}
              </div>

              {p.verification_status === "pending" && (
                <>
                  <Textarea
                    placeholder="Notes de vérification (optionnel)…"
                    value={notes[p.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [p.id]: e.target.value }))}
                    className="text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => decide(p.id, "approved")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <Check className="w-4 h-4 mr-1" /> Approuver
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => decide(p.id, "rejected")} className="flex-1">
                      <X className="w-4 h-4 mr-1" /> Refuser
                    </Button>
                  </div>
                </>
              )}
              {p.verification_notes && (
                <p className="text-xs italic text-muted-foreground">« {p.verification_notes} »</p>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default AdminProviders;
