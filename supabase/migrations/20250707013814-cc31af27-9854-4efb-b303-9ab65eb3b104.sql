
-- Update the Instagram posts to include image URLs for better visibility
UPDATE public.instagram_posts 
SET image_url = 'https://scontent-syd2-1.cdninstagram.com/v/t51.29350-15/470513167_18473015539018464_8708162517916798351_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=18de74&_nc_ohc=yN6d5zMvNgsQ7kNvgGTu4h_&_nc_zt=23&_nc_ht=scontent-syd2-1.cdninstagram.com&edm=ANo9K5cEAAAA&oh=00_AYAm8vCQTZoiMBpSVK-H4fQrRyZQgPXG3V-JFUvGQh4HpA&oe=677AA34F'
WHERE post_url = 'https://www.instagram.com/p/DLOm8wKTE7I/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';
