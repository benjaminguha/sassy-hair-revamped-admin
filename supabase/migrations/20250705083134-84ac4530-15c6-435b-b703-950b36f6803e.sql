
-- Update the admin user record with the correct user ID
UPDATE admin_users 
SET user_id = 'd408b5cd-7a1a-4269-8e29-6e023b40b3bc'
WHERE email = 'sassy@benguha.com';

-- If the record doesn't exist, insert it with the correct user ID
INSERT INTO admin_users (user_id, email, role, is_active) 
VALUES (
  'd408b5cd-7a1a-4269-8e29-6e023b40b3bc', 
  'sassy@benguha.com', 
  'super_admin', 
  true
) ON CONFLICT (email) DO UPDATE SET
  user_id = 'd408b5cd-7a1a-4269-8e29-6e023b40b3bc',
  role = 'super_admin',
  is_active = true;
