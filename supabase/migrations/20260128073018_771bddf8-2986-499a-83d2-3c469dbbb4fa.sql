-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to notify providers of new orders
CREATE OR REPLACE FUNCTION public.notify_providers_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert notification for all online providers
  INSERT INTO public.notifications (user_id, title, message, type, data)
  SELECT 
    p.user_id,
    'Nouvelle mission disponible',
    'Une nouvelle demande de ' || NEW.service_type || ' est disponible près de vous',
    'new_order',
    jsonb_build_object('order_id', NEW.id, 'service_type', NEW.service_type, 'address', NEW.address)
  FROM public.providers p
  WHERE p.is_online = true;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new orders
CREATE TRIGGER on_new_order_notify_providers
AFTER INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION public.notify_providers_new_order();