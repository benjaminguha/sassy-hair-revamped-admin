
-- Create the admin user with the specified credentials
-- First, we need to insert the user into auth.users (this will be done through the signup process)
-- Then add them to admin_users table

-- Insert the admin user into our admin_users table
-- Note: The actual auth user will be created through the signup process
INSERT INTO public.admin_users (user_id, email, role, is_active) 
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder, will be updated after user creation
  'sassyadmin@sassyhair.com',
  'super_admin',
  true
);

-- Add a new table for managing admin user invitations/creation
CREATE TABLE public.admin_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  invited_by UUID REFERENCES auth.users,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days')
);

-- Enable RLS on admin invitations
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Policy for super admins to manage invitations
CREATE POLICY "Super admins can manage invitations" 
  ON public.admin_invitations 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true AND role = 'super_admin'
    )
  );

-- Update admin_users policies to allow super admins to manage other admins
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

CREATE POLICY "Admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage admin users" 
  ON public.admin_users 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true AND role = 'super_admin'
    )
  );
