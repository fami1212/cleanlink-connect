
-- 1. Order cancellation fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS cancelled_by uuid,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS refund_status text CHECK (refund_status IN ('none','pending','processed','refused')) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS refund_amount numeric;

-- 2. Disputes table
CREATE TABLE IF NOT EXISTS public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  provider_id uuid,
  category text NOT NULL CHECK (category IN ('non_service','service_incomplet','prix','comportement','securite','autre')),
  description text NOT NULL,
  disputed_amount numeric,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_review','resolved','rejected')),
  resolution text,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.disputes TO authenticated;
GRANT ALL ON public.disputes TO service_role;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see their own disputes"
  ON public.disputes FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Providers see disputes about them"
  ON public.disputes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = disputes.provider_id AND p.user_id = auth.uid()));

CREATE POLICY "Admins/authority see all disputes"
  ON public.disputes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'authority'));

CREATE POLICY "Clients create their own disputes"
  ON public.disputes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins update disputes"
  ON public.disputes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  provider_id uuid,
  invoice_number text NOT NULL UNIQUE,
  amount_ht numeric NOT NULL,
  tva_rate numeric NOT NULL DEFAULT 18,
  amount_tva numeric NOT NULL,
  amount_ttc numeric NOT NULL,
  pdf_url text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see their invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Providers see their invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.providers p WHERE p.id = invoices.provider_id AND p.user_id = auth.uid()));

CREATE POLICY "Admins/authority see all invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'authority'));

CREATE POLICY "Clients create invoice for their orders"
  ON public.invoices FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1000;
GRANT USAGE ON SEQUENCE public.invoice_number_seq TO authenticated;

CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'LKE-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0');
$$;

GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO authenticated;
