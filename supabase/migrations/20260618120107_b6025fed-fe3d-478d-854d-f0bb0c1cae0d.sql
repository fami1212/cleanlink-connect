
-- 1. Prevent privilege escalation on user_roles: only allow self-assigning 'client'
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

CREATE POLICY "Users can self-assign client role only"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND role = 'client'::user_role);

-- Provider role assignment must go through service_role (edge function) or admin
-- (handled separately via provider registration workflow)

-- 2. Notifications: restrict policies to authenticated role
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users insert their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insertion of notifications is done by SECURITY DEFINER trigger (notify_providers_new_order)
-- using service_role context; no client INSERT is needed.
-- We still allow self-insert for any client-initiated notification flows.
CREATE POLICY "Users insert their own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
