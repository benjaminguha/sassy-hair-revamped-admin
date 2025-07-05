
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data.reduce((acc, setting) => ({
        ...acc,
        [setting.key]: setting.value
      }), {});
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroCarousel />
      <ServicesSection />
      <AboutSection />
      <GallerySection />
      <ContactSection siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Index;
