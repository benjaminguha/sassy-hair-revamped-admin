
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AboutSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: carouselImages = [] } = useQuery({
    queryKey: ['carouselImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (carouselImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Section with Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Carousel on the left */}
          <div className="relative h-96 overflow-hidden rounded-lg">
            {carouselImages.length > 0 ? (
              <>
                {carouselImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || "Carousel image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {carouselImages.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
                    >
                      <ChevronRight size={24} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {carouselImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-pink-400 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold">Sassy Hair</h3>
                  <p className="text-lg">Professional styling</p>
                </div>
              </div>
            )}
          </div>

          {/* Content on the right */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">We're Changing the Way People Think About Hair</h2>
            <p className="text-lg text-gray-600 mb-6">
              Styles, trends, and fashions are forever changing. At Sassy Hair, we aim to combine the very best Keune products with our highly skilled and trained stylists to remain at the very cutting edge.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our mission is to build long-lasting friendships with you, our fabulous clients. We listen, we're attentive, and we want nothing more than for you to leave our salons feeling happy, vibrant and loving your new look.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              With salons located centrally in Weston and Pearce, we aren't ever too far from you.
            </p>
            <p className="text-lg text-gray-600">
              Established in 2005, we have a long and proud association with the Canberra region.
            </p>
          </div>
        </div>

        {/* Second Section with Quote and Image Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content on the left */}
          <div>
            <p className="text-lg text-gray-600 mb-8">
              Our aim is to create a warm, welcoming space allowing you to relax in comfort. We've worked hard to build a highly skilled team, passionate about their craft who enjoy bringing about the change you're looking for.
            </p>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900 mb-2">Bec & Dan</p>
              <p className="text-gray-600">Co-Founders</p>
            </div>
          </div>

          {/* Image Collage on the right */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Salon collage 1"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
            </div>
            <div className="relative mt-8">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Salon collage 2"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Keune Section */}
        <div className="text-center bg-gray-50 rounded-lg p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">KEUNE, THROUGH & THROUGH</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-4xl mx-auto">
            Founded in 1922, family-owned and operated Keune symbolises many of the qualities we promote through our team – love, passion, skill, honesty, open communication, social responsibility, and trust.
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
            Their hair care products are produced in house and exported to over 70 countries worldwide. We carry the largest range of Keune hair products in Canberra and we're proud to call ourselves members of their global family.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Get a refill of your keune products without having to come in
          </p>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
