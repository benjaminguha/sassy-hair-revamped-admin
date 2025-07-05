
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-pink-600">Sassy Hair</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-gray-900 hover:text-pink-600 transition-colors">Home</a>
              <a href="#services" className="text-gray-900 hover:text-pink-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-900 hover:text-pink-600 transition-colors">About</a>
              <a href="#gallery" className="text-gray-900 hover:text-pink-600 transition-colors">Gallery</a>
              <a href="#contact" className="text-gray-900 hover:text-pink-600 transition-colors">Contact</a>
              <Link to="/admin" className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors">
                Admin
              </Link>
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
            <a href="#home" className="block px-3 py-2 text-gray-900 hover:text-pink-600 transition-colors">Home</a>
            <a href="#services" className="block px-3 py-2 text-gray-900 hover:text-pink-600 transition-colors">Services</a>
            <a href="#about" className="block px-3 py-2 text-gray-900 hover:text-pink-600 transition-colors">About</a>
            <a href="#gallery" className="block px-3 py-2 text-gray-900 hover:text-pink-600 transition-colors">Gallery</a>
            <a href="#contact" className="block px-3 py-2 text-gray-900 hover:text-pink-600 transition-colors">Contact</a>
            <Link to="/admin" className="block px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
