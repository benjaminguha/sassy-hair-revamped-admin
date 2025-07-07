
import { Link } from "react-router-dom";

interface FooterProps {
  siteSettings?: Record<string, string>;
}

const Footer = ({ siteSettings }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-cursive font-bold text-pink-400 mb-4">Sassy Hair</h3>
            <p className="text-gray-300">
              {siteSettings?.site_description || "Professional hair styling and beauty services"}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-cursive font-semibold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-pink-400 transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-pink-400 transition-colors">Services</Link></li>
              <li><Link to="/stylists" className="text-gray-300 hover:text-pink-400 transition-colors">Stylists</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-pink-400 transition-colors">About</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-pink-400 transition-colors">Gallery</Link></li>
              <li><Link to="/collective" className="text-gray-300 hover:text-pink-400 transition-colors">The Sassy Collective</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-cursive font-semibold text-primary mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>{siteSettings?.contact_phone || "+1 (555) 123-4567"}</p>
              <p>{siteSettings?.contact_email || "info@sassyhair.com"}</p>
              <p>{siteSettings?.address || "123 Beauty Lane, Style City, SC 12345"}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Sassy Hair Salon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
