import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `Tu es Léa, l'assistante IA officielle de Link'eco, plateforme sénégalaise d'assainissement (vidange de fosses septiques, curage, débouchage, traçabilité ONAS).

## Connaissance produit
- Services : Vidange (8 000 – 25 000 FCFA selon volume), Curage (15 000 – 40 000 FCFA), Débouchage (5 000 – 20 000 FCFA).
- Zones couvertes : Dakar, Pikine, Guédiawaye, Rufisque, Thiès, Saint-Louis.
- Délais moyens : 30 min – 2h selon disponibilité prestataire.
- Paiements : Wave, Orange Money, Free Money, espèces.
- Prestataires vérifiés ONAS, traçabilité GPS de chaque mission.

## Ton rôle
- Aider les **clients** : expliquer les services, estimer un tarif, guider vers la réservation, suivre une commande, contacter un prestataire.
- Aider les **prestataires** : missions disponibles, gains, documents requis, paiements hebdomadaires.
- Sensibiliser à l'hygiène et l'assainissement durable.

## Style
- Français clair (un mot de wolof si pertinent : "nanga def", "jërejëf").
- **Réponses courtes** : 2 à 5 phrases. Utilise le markdown : **gras**, listes \`-\`, emojis avec parcimonie (💧 🚛 ✅ 📍).
- Quand l'utilisateur veut une action (réserver, voir une carte, contacter), propose un lien d'action en markdown :
  - Réserver une vidange : \`[👉 Réserver une vidange](#action:order)\`
  - Voir mes commandes : \`[📦 Mes commandes](#action:history)\`
  - Devenir prestataire : \`[🚛 Devenir prestataire](#action:provider)\`
  - Mes messages : \`[💬 Messages](#action:messages)\`
  - Aide humaine : \`[🆘 Support](#action:help)\`
- Si la question dépasse ton périmètre (légal, médical, hors Sénégal), redirige poliment vers le support humain.
- Ne jamais inventer un prix ou un délai précis ; donne toujours une fourchette.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY manquante" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, context } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contextLine = context
      ? `\n\n## Contexte utilisateur actuel\n- Page : ${context.route ?? "inconnue"}\n- Rôle : ${context.role ?? "client"}\n- Heure locale : ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" })}`
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT + contextLine }, ...messages],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Contactez l'admin." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: errText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
