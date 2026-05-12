
-- 1. order_tracks table for route history
CREATE TABLE public.order_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  speed numeric,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_tracks_order ON public.order_tracks(order_id, recorded_at);

ALTER TABLE public.order_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view tracks of their orders"
ON public.order_tracks FOR SELECT
USING (order_id IN (SELECT id FROM public.orders WHERE client_id = auth.uid()));

CREATE POLICY "Providers view their own tracks"
ON public.order_tracks FOR SELECT
USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

CREATE POLICY "Providers insert their own tracks"
ON public.order_tracks FOR INSERT
WITH CHECK (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

-- 2. Trigger: auto-append track when provider's lat/lng changes during active mission
CREATE OR REPLACE FUNCTION public.record_provider_track()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_order_id uuid;
BEGIN
  IF NEW.latitude IS NULL OR NEW.longitude IS NULL THEN
    RETURN NEW;
  END IF;
  IF OLD.latitude IS NOT DISTINCT FROM NEW.latitude
     AND OLD.longitude IS NOT DISTINCT FROM NEW.longitude THEN
    RETURN NEW;
  END IF;

  SELECT id INTO active_order_id
  FROM public.orders
  WHERE provider_id = NEW.id
    AND status IN ('accepted','in_progress')
  ORDER BY accepted_at DESC NULLS LAST
  LIMIT 1;

  IF active_order_id IS NOT NULL THEN
    INSERT INTO public.order_tracks (order_id, provider_id, latitude, longitude)
    VALUES (active_order_id, NEW.id, NEW.latitude, NEW.longitude);
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_provider_track() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_record_provider_track ON public.providers;
CREATE TRIGGER trg_record_provider_track
AFTER UPDATE OF latitude, longitude ON public.providers
FOR EACH ROW EXECUTE FUNCTION public.record_provider_track();

-- Enable realtime
ALTER TABLE public.order_tracks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_tracks;

-- 3. Tighten notifications INSERT (trigger is SECURITY DEFINER so it still works)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Users insert their own notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Restrict avatars bucket listing (public read of file URLs still works via CDN)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Users list their own avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND (auth.uid()::text = (storage.foldername(name))[1])
);

-- 5. Revoke EXECUTE on internal trigger functions (they don't need to be callable)
REVOKE EXECUTE ON FUNCTION public.notify_providers_new_order() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
