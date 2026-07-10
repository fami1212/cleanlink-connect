import { supabase } from "@/integrations/supabase/client";

export type AiEventType =
  | "estimate"
  | "photo_analysis"
  | "review_summary"
  | "assistant_message";

export type AiEventStatus = "success" | "error" | "degraded" | "rate_limited" | "no_credits";

export async function logAiEvent(
  event_type: AiEventType,
  status: AiEventStatus,
  meta: Record<string, unknown> = {}
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase.from("ai_usage_events") as any).insert({
      user_id: user.id,
      event_type,
      status,
      meta,
    });
  } catch {
    // silent — telemetry never blocks UX
  }
}
