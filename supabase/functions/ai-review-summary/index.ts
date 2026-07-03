import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `Tu es le module de synthèse & modération des avis Link'eco (Sénégal, assainissement).
On te donne une liste d'avis clients (rating 1-5 + notes). Renvoie STRICTEMENT ce JSON:
{
  "summary": string (2-3 phrases français, ton neutre pro),
  "strengths": string[] (max 3, courts),
  "improvements": string[] (max 3, courts),
  "sentiment": "positive"|"mixed"|"negative",
  "flagged": [{ "index": number, "reason": string }] (avis potentiellement injurieux, spam ou hors-sujet)
}`;

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

    const { reviews } = await req.json();
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return new Response(JSON.stringify({
        summary: "Pas encore assez d'avis pour une synthèse.",
        strengths: [],
        improvements: [],
        sentiment: "mixed",
        flagged: [],
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const formatted = reviews
      .map((r: any, i: number) => `#${i} [${r.rating}/5] ${r.notes || "(sans commentaire)"}`)
      .join("\n");

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
          { role: "user", content: `Avis:\n${formatted}` },
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
    return new Response(content, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
