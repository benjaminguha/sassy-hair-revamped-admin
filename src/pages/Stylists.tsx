
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Instagram } from "lucide-react";

const Stylists = () => {
  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

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
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Stylists</h1>
              <p className="text-xl text-gray-600">Talented professionals dedicated to making you look and feel amazing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stylists.map((stylist) => (
                <div
                  key={stylist.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {stylist.image_url && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={stylist.image_url}
                        alt={stylist.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{stylist.name}</h3>
                    {stylist.title && (
                      <p className="text-pink-600 font-medium mb-3">{stylist.title}</p>
                    )}
                    
                    {stylist.bio && (
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{stylist.bio}</p>
                    )}
                    
                    {stylist.specialties && stylist.specialties.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {stylist.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {stylist.instagram_handle && (
                      <div className="flex items-center justify-center">
                        <a
                          href={`https://instagram.com/${stylist.instagram_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm">@{stylist.instagram_handle}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Stylists;
