import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `Tu es un expert en assainissement pour Link'eco (Sénégal). Analyse la photo d'une fosse/latrine/canalisation et renvoie STRICTEMENT un JSON:
{
  "type_detected": "fosse_septique"|"latrines"|"canalisation"|"autre",
  "fill_level": "vide"|"faible"|"moyen"|"plein"|"debordement",
  "estimated_volume_liters": number,
  "urgency": "low"|"medium"|"high"|"critical",
  "recommended_service": "fosse_septique"|"latrines"|"urgence"|"curage",
  "estimated_price_min": number (FCFA),
  "estimated_price_max": number (FCFA),
  "observations": string (2-3 phrases en français, ce que tu vois),
  "safety_warnings": string[] (0 à 3 alertes courtes)
}
Sois prudent : si photo floue/inadéquate, mets confidence basse et fill_level "moyen".`;

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

    const { image_url, mime_type } = await req.json();
    if (!image_url) {
      return new Response(JSON.stringify({ error: "image_url requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imgUrl = image_url.startsWith("data:") || image_url.startsWith("http")
      ? image_url
      : `data:${mime_type || "image/jpeg"};base64,${image_url}`;

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
          {
            role: "user",
            content: [
              { type: "text", text: "Analyse cette photo et donne le JSON d'analyse." },
              { type: "image_url", image_url: { url: imgUrl } },
            ],
          },
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
