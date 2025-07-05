
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Sassy Hair</h2>
            <p className="text-lg text-gray-600 mb-6">
              Welcome to Sassy Hair, where beauty meets expertise. Our team of professional 
              stylists is dedicated to helping you look and feel your absolute best.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              With years of experience in the latest trends and techniques, we offer a full 
              range of hair services from cutting and coloring to special event styling.
            </p>
            <p className="text-lg text-gray-600">
              Our salon provides a relaxing, welcoming environment where you can unwind 
              while we transform your look.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
              alt="Salon interior"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-600 rounded-full opacity-20"></div>
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-purple-600 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
