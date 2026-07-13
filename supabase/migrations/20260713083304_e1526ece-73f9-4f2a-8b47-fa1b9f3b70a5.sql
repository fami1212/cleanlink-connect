
-- Provider verification workflow
ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','approved','rejected')),
  ADD COLUMN IF NOT EXISTS verification_notes TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID;

-- Review moderation columns on orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS review_comment TEXT,
  ADD COLUMN IF NOT EXISTS review_hidden BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS review_flag_reason TEXT,
  ADD COLUMN IF NOT EXISTS review_moderated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_moderated_by UUID;

-- Admin policies
DROP POLICY IF EXISTS "Admins can view all providers" ON public.providers;
CREATE POLICY "Admins can view all providers" ON public.providers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all providers" ON public.providers;
CREATE POLICY "Admins can update all providers" ON public.providers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authority can view all orders" ON public.orders;
CREATE POLICY "Authority can view all orders" ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'authority'));

DROP POLICY IF EXISTS "Authority can view all tracks" ON public.order_tracks;
CREATE POLICY "Authority can view all tracks" ON public.order_tracks FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'authority') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: verification_status -> 'approved' auto sets is_verified
CREATE OR REPLACE FUNCTION public.sync_provider_verified()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.verification_status = 'approved' AND (OLD.verification_status IS DISTINCT FROM 'approved') THEN
    NEW.is_verified := true;
    NEW.verified_at := now();
  ELSIF NEW.verification_status = 'rejected' THEN
    NEW.is_verified := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_provider_verified ON public.providers;
CREATE TRIGGER trg_sync_provider_verified
  BEFORE UPDATE OF verification_status ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.sync_provider_verified();
