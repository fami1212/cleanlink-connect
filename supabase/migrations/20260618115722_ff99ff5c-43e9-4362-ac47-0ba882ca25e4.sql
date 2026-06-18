
-- 1. Deny anonymous access to orders, profiles, user_roles via RESTRICTIVE policies
CREATE POLICY "Deny anonymous access to orders"
ON public.orders AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles AS RESTRICTIVE
FOR ALL TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Providers table: restrict public listing to authenticated users only,
-- and hide sensitive columns (device_token, document URLs) from public exposure
DROP POLICY IF EXISTS "Anyone can view online providers" ON public.providers;

CREATE POLICY "Authenticated users can view online providers"
ON public.providers
FOR SELECT
TO authenticated
USING ((is_online = true) OR (auth.uid() = user_id));

-- Revoke column-level access on sensitive provider columns
REVOKE SELECT (device_token, license_url, vehicle_registration_url) ON public.providers FROM anon, authenticated;

-- Re-grant SELECT on all other columns to authenticated
GRANT SELECT (
  id, user_id, company_name, is_online, is_verified, vehicle_type,
  capacity_liters, rating, total_missions, latitude, longitude,
  created_at, last_location_at, work_zone_radius
) ON public.providers TO authenticated;

-- Owner-only access to sensitive provider columns via a security-definer helper
GRANT SELECT (device_token, license_url, vehicle_registration_url)
  ON public.providers TO service_role;
