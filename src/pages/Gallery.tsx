
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: galleryPhotos = [] } = useQuery({
    queryKey: ['galleryPhotos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
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

  const categories = ['all', ...new Set(galleryPhotos.map(photo => photo.category).filter(Boolean))];
  
  const filteredPhotos = selectedCategory === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Work</h1>
              <p className="text-xl text-gray-600">Showcasing our latest creations</p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full transition-colors capitalize ${
                      selectedCategory === category
                        ? 'bg-pink-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-pink-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group overflow-hidden rounded-lg shadow-lg aspect-square"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title || "Gallery image"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        {photo.title && (
                          <h3 className="text-lg font-semibold mb-2">{photo.title}</h3>
                        )}
                        {photo.category && (
                          <p className="text-sm capitalize">{photo.category}</p>
                        )}
                      </div>
                    </div>
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

export default Gallery;
