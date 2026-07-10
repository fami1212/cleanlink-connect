
CREATE TABLE public.ai_usage_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_events_user_created ON public.ai_usage_events(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_events_type ON public.ai_usage_events(event_type, created_at DESC);

GRANT SELECT, INSERT ON public.ai_usage_events TO authenticated;
GRANT ALL ON public.ai_usage_events TO service_role;

ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert their own ai usage events"
  ON public.ai_usage_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read their own ai usage events"
  ON public.ai_usage_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
