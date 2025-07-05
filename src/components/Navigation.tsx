
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => 
    `transition-colors ${isActive(path) 
      ? 'text-pink-600 font-medium' 
      : 'text-gray-900 hover:text-pink-600'
    }`;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-pink-600">
              Sassy Hair
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={navLinkClass("/")}>Home</Link>
              <Link to="/services" className={navLinkClass("/services")}>Services</Link>
              <Link to="/about" className={navLinkClass("/about")}>About</Link>
              <Link to="/gallery" className={navLinkClass("/gallery")}>Gallery</Link>
              <Link to="/collective" className={navLinkClass("/collective")}>The Sassy Collective</Link>
              <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>
              <a 
                href="https://app.salonrunner.com/customer/login.htm?id=27134"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
              >
                Book Online
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-pink-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link to="/" className={`block px-3 py-2 ${navLinkClass("/")}`}>Home</Link>
            <Link to="/services" className={`block px-3 py-2 ${navLinkClass("/services")}`}>Services</Link>
            <Link to="/about" className={`block px-3 py-2 ${navLinkClass("/about")}`}>About</Link>
            <Link to="/gallery" className={`block px-3 py-2 ${navLinkClass("/gallery")}`}>Gallery</Link>
            <Link to="/collective" className={`block px-3 py-2 ${navLinkClass("/collective")}`}>The Sassy Collective</Link>
            <Link to="/contact" className={`block px-3 py-2 ${navLinkClass("/contact")}`}>Contact</Link>
            <a 
              href="https://app.salonrunner.com/customer/login.htm?id=27134"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Book Online
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
