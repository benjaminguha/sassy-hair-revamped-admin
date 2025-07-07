import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

const Collective = () => {
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
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-cursive font-bold text-gray-900 mb-4">The Sassy Collective</h1>
              <p className="text-xl text-pink-600 font-semibold">Your Chair. Your Clients. Our Space.</p>
            </div>

            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                Looking for a professional, welcoming, and stylish space to grow your hairdressing business? 
                At Sassy Hair, we offer chair rental opportunities for experienced stylists ready to run 
                their own business on their own terms.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Whether you're an established stylist with your own clientele or looking to move toward 
                greater independence, we provide the environment and support to make it happen. Enjoy the 
                freedom of managing your own schedule while working alongside a collaborative team in a 
                beautifully maintained salon.
              </p>
              
              <p className="text-lg leading-relaxed mb-8">
                If you're interested in learning more about how it works, we'd love to hear from you. 
                Let's chat about your future at The Sassy Collective or Sassy Hair Pearce.
              </p>

              <div className="text-center">
                <a
                  href={`mailto:${(siteSettings as any)?.contact_email || 'info@sassyhair.com'}?subject=Sassy Collective Inquiry`}
                  className="inline-flex items-center px-8 py-4 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Collective;
