
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Create a simple policy that allows authenticated users to read admin_users
-- This breaks the recursion by not referencing admin_users within its own policy
CREATE POLICY "Authenticated users can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create a policy for super admins to manage other admin users
-- We'll use a security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1 
    AND admin_users.is_active = true 
    AND admin_users.role = 'super_admin'
  );
$$;

-- Policy for super admins to manage admin users using the security definer function
CREATE POLICY "Super admins can manage admin users" 
  ON public.admin_users 
  FOR ALL 
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));
