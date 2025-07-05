
-- First, let's check if the record exists
SELECT * FROM admin_users WHERE email = 'sassy@benguha.com';

-- Delete any existing record and insert a fresh one
DELETE FROM admin_users WHERE email = 'sassy@benguha.com';

INSERT INTO admin_users (user_id, email, role, is_active) 
VALUES (
  'd408b5cd-7a1a-4269-8e29-6e023b40b3bc', 
  'sassy@benguha.com', 
  'super_admin', 
  true
);
