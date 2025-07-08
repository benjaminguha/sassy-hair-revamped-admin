
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Separator } from "./ui/separator";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/9bfd7e07-a4dd-4d72-a31b-740d29375634.png" 
                  alt="Sassy Hair" 
                  className="h-12 w-12"
                />
                <Separator orientation="vertical" className="h-8" />
                <img 
                  src="/lovable-uploads/1d8798c7-f4f1-44dc-96ea-91064937ace5.png" 
                  alt="Keune Hair Cosmetics" 
                  className="h-8"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              About
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/services") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Services
            </Link>
            <Link
              to="/stylists"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/stylists") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Stylists
            </Link>
            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/gallery") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/collective"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/collective") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              The Sassy Collective
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/contact") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Contact
            </Link>
            <a
              href="https://app.salonrunner.com/customer/login.htm?id=27134"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Book Online
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/about") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/services") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/stylists"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/stylists") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Stylists
            </Link>
            <Link
              to="/gallery"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/gallery") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/collective"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/collective") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              The Sassy Collective
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/contact") ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:text-pink-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <a
              href="https://app.salonrunner.com/customer/login.htm?id=27134"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
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
