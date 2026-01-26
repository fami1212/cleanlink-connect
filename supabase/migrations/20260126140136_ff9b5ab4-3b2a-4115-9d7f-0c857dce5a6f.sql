-- Add new columns to providers table for push notifications and location tracking
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS device_token TEXT,
ADD COLUMN IF NOT EXISTS last_location_at TIMESTAMP WITH TIME ZONE;

-- Add RLS policy for providers to view pending orders (missions without provider_id)
CREATE POLICY "Providers can view pending orders" 
ON public.orders 
FOR SELECT 
USING (
  status = 'pending' 
  AND provider_id IS NULL 
  AND public.has_role(auth.uid(), 'provider')
);

-- Add RLS policy for providers to accept pending orders
CREATE POLICY "Providers can accept pending orders" 
ON public.orders 
FOR UPDATE 
USING (
  status = 'pending' 
  AND provider_id IS NULL 
  AND public.has_role(auth.uid(), 'provider')
)
WITH CHECK (
  provider_id IN (
    SELECT id FROM providers WHERE user_id = auth.uid()
  )
);