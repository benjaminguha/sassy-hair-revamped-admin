
-- Create tables for the hair salon website content management

-- Table for carousel/hero images
CREATE TABLE public.carousel_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for gallery photos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  category TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for site settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for admin users (for the admin panel)
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for the frontend)
CREATE POLICY "Public can view active carousel images" 
  ON public.carousel_images 
  FOR SELECT 
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can view active services" 
  ON public.services 
  FOR SELECT 
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can view active gallery photos" 
  ON public.gallery_photos 
  FOR SELECT 
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can view site settings" 
  ON public.site_settings 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create policies for admin access
CREATE POLICY "Admins can manage carousel images" 
  ON public.carousel_images 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can manage services" 
  ON public.services 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can manage gallery photos" 
  ON public.gallery_photos 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

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

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('salon-images', 'salon-images', true);

-- Create storage policies
CREATE POLICY "Public can view salon images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'salon-images');

CREATE POLICY "Admins can upload salon images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'salon-images' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update salon images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'salon-images' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete salon images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'salon-images' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Insert some sample data
INSERT INTO public.site_settings (key, value) VALUES 
('site_title', 'Sassy Hair Salon'),
('site_description', 'Professional hair styling and beauty services'),
('contact_phone', '+1 (555) 123-4567'),
('contact_email', 'info@sassyhair.com'),
('address', '123 Beauty Lane, Style City, SC 12345'),
('hours', 'Mon-Fri: 9AM-7PM, Sat: 8AM-6PM, Sun: 10AM-4PM');

INSERT INTO public.services (name, description, price, order_index) VALUES 
('Hair Cut & Style', 'Professional cut and styling service', 'From $65', 1),
('Hair Coloring', 'Full color, highlights, and balayage services', 'From $120', 2),
('Hair Treatment', 'Deep conditioning and repair treatments', 'From $85', 3),
('Special Occasions', 'Bridal and event styling', 'From $150', 4),
('Extensions', 'Professional hair extension application', 'From $200', 5),
('Consultation', 'Color and style consultation', 'Free', 6);

INSERT INTO public.carousel_images (image_url, title, subtitle, order_index) VALUES 
('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', 'Welcome to Sassy Hair', 'Professional styling for every occasion', 1),
('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', 'Expert Hair Coloring', 'Transform your look with our color specialists', 2),
('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', 'Bridal & Special Events', 'Make your special day perfect', 3);

INSERT INTO public.gallery_photos (image_url, title, category, order_index) VALUES 
('https://images.unsplash.com/photo-1595475207225-428b62bda831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', 'Elegant Updo', 'styling', 1),
('https://images.unsplash.com/photo-1559599101-f09722fb4948?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', 'Color Transformation', 'coloring', 2),
('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', 'Modern Cut', 'cutting', 3),
('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80', 'Bridal Style', 'bridal', 4),
('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', 'Beach Waves', 'styling', 5),
('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Highlights', 'coloring', 6);
