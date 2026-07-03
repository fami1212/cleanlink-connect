import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `Tu es le moteur d'estimation intelligente de Link'eco (Sénégal, assainissement).
À partir des données fournies (type de service, adresse/zone, volume estimé, urgence, heure), renvoie STRICTEMENT un JSON avec:
{
  "price_min": number (FCFA),
  "price_max": number (FCFA),
  "confidence": "low"|"medium"|"high",
  "duration_min": number (minutes),
  "eta_min": number (minutes avant intervention),
  "explanation": string (1-2 phrases, français),
  "tips": string[] (2 conseils courts pour réduire le coût ou préparer l'intervention)
}
Barèmes indicatifs :
- Vidange fosse septique : 20 000 - 35 000 FCFA (durée 45-90 min)
- Vidange latrines : 12 000 - 22 000 FCFA (durée 30-60 min)
- Urgence débordement : 30 000 - 55 000 FCFA (durée 60-120 min, +30% si nuit)
- Curage canalisations : 18 000 - 35 000 FCFA (durée 45-90 min)
Ajuste selon zone (Dakar centre = standard, périphérie +15%, régions éloignées +25%), urgence (+20-40%), heure (nuit 22h-6h +30%).`;

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

    const body = await req.json();
    const { service_type, address, urgency, volume, hour } = body;

    const userPrompt = `Estime cette intervention:
- Service: ${service_type}
- Adresse/zone: ${address || "non précisée"}
- Volume estimé: ${volume || "moyen"}
- Urgence: ${urgency ? "oui" : "non"}
- Heure locale: ${hour ?? new Date().getHours()}h`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
