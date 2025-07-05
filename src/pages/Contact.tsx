
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
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
        <ContactSection siteSettings={siteSettings} />
      </div>
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Contact;
