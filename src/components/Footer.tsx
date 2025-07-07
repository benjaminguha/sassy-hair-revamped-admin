
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
            <h3 className="text-2xl font-cursive font-bold text-pink-400 mb-4">Sassy Hair Salon | The Best Hairdressers & Stylists in Canberra</h3>
            <p className="text-gray-300 mb-4">
              Some Filler Text
            </p>
            <p className="text-gray-400 text-sm mb-2">
              © 2022 Sassy Hair. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Privacy Policy | Images courtesy of Keune
            </p>
            <div className="text-gray-400 text-xs space-y-1">
              <p>* Prices listed are starting prices, subject to hair length. Finishing service not included.</p>
              <p>All technical services must include a finishing service to guarantee results.</p>
              <p>** Regrowth of no more than 6 weeks</p>
            </div>
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
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-semibold">Phone:</p>
                <p>02 6288 9922</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>appointments@sassyhair.com.au</p>
              </div>
              <div>
                <p className="font-semibold">Sassy Hair Pearce:</p>
                <p className="text-sm">Unit 3A, 70 Hodgson Crescent, Pearce ACT 2607</p>
              </div>
              <div>
                <p className="font-semibold">The Sassy Collective Weston:</p>
                <p className="text-sm">Unit 20, 41-43 Liardet Street, Weston ACT 2611</p>
              </div>
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
