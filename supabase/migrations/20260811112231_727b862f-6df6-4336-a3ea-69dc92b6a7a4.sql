CREATE OR REPLACE FUNCTION public.get_order_contact(_order_id uuid)
RETURNS TABLE(full_name text, phone text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- client viewing their provider
  SELECT p.full_name, p.phone, p.avatar_url
  FROM public.orders o
  JOIN public.providers pr ON pr.id = o.provider_id
  JOIN public.profiles p ON p.user_id = pr.user_id
  WHERE o.id = _order_id
    AND o.client_id = auth.uid()
  UNION ALL
  -- provider viewing their client
  SELECT p.full_name, p.phone, p.avatar_url
  FROM public.orders o
  JOIN public.providers pr ON pr.id = o.provider_id
  JOIN public.profiles p ON p.user_id = o.client_id
  WHERE o.id = _order_id
    AND pr.user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.get_order_contact(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_order_contact(uuid) TO authenticated;