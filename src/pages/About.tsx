
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
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
      <div className="pt-16">
        <AboutSection />
      </div>
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default About;
