-- Create a storage bucket for provider documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-documents', 'provider-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for provider documents bucket
CREATE POLICY "Providers can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'provider-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Providers can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'provider-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Providers can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'provider-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Providers can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'provider-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add document columns to providers table
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS license_url TEXT,
ADD COLUMN IF NOT EXISTS vehicle_registration_url TEXT;