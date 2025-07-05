
-- First, let's check if we need to create the admin user account
-- Insert the admin user into auth.users (this would normally be done through Supabase Auth)
-- Since we can't directly insert into auth.users, we need to create the user through the auth system first

-- For now, let's ensure the admin_users table has the correct structure
-- and insert a record that will match when the user signs up
INSERT INTO admin_users (user_id, email, role, is_active) 
VALUES (
  'auth-user-id-placeholder', 
  'sassyadmin@sassyhair.com', 
  'super_admin', 
  true
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true;
