
-- Clear existing Instagram posts
DELETE FROM public.instagram_posts;

-- Add the same Instagram post 5 times with different order indices
INSERT INTO public.instagram_posts (post_url, order_index, is_active) VALUES
('https://www.instagram.com/p/DLOm8wKTE7I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', 0, true),
('https://www.instagram.com/p/DLOm8wKTE7I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', 1, true),
('https://www.instagram.com/p/DLOm8wKTE7I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', 2, true),
('https://www.instagram.com/p/DLOm8wKTE7I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', 3, true),
('https://www.instagram.com/p/DLOm8wKTE7I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', 4, true);
