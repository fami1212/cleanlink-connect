
DROP POLICY IF EXISTS "Users can self-assign client role only" ON public.user_roles;

CREATE POLICY "Users can self-assign client role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'client'::user_role
);

CREATE POLICY "Users can self-assign provider role with documents"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'provider'::user_role
  AND EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.user_id = auth.uid()
      AND p.license_url IS NOT NULL
      AND p.vehicle_registration_url IS NOT NULL
  )
);
