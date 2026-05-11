ALTER TABLE public.providers REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'providers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.providers;
  END IF;
END $$;