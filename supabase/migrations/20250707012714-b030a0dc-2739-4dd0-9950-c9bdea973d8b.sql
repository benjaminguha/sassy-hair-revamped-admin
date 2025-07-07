
-- Create stylists table
CREATE TABLE public.stylists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  image_url TEXT,
  instagram_handle TEXT,
  specialties TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create instagram_posts table
CREATE TABLE public.instagram_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_url TEXT NOT NULL,
  image_url TEXT,
  caption TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for stylists table
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;

-- Create policies for stylists
CREATE POLICY "Public can view active stylists" 
  ON public.stylists 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage stylists" 
  ON public.stylists 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  ));

-- Enable RLS for instagram_posts table
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for instagram_posts
CREATE POLICY "Public can view active instagram posts" 
  ON public.instagram_posts 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage instagram posts" 
  ON public.instagram_posts 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  ));
