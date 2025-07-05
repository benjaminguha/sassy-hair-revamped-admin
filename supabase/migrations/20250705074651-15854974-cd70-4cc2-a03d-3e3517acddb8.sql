

-- Update the admin_users table with the correct user ID
-- The user has been created in Supabase Auth with ID: 1cf535e7-b1d7-42a6-a25b-a438c457aeb1
UPDATE admin_users 
SET user_id = '1cf535e7-b1d7-42a6-a25b-a438c457aeb1'
WHERE email = 'sassyadmin@sassyhair.com';

-- If the record doesn't exist, insert it
INSERT INTO admin_users (user_id, email, role, is_active) 
VALUES (
  '1cf535e7-b1d7-42a6-a25b-a438c457aeb1', 
  'sassyadmin@sassyhair.com', 
  'super_admin', 
  true
) ON CONFLICT (email) DO UPDATE SET
  user_id = '1cf535e7-b1d7-42a6-a25b-a438c457aeb1',
  role = 'super_admin',
  is_active = true;

