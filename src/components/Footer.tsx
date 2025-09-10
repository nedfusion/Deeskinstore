import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d0499] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">DeeSkinStore</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for premium skincare products. We believe everyone deserves healthy, glowing skin.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#c6f2f4] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/deeskinstore" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#c6f2f4] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/deeskinstore" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#c6f2f4] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Skincare Guide</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Ingredient Glossary</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-[#c6f2f4] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>123 Beauty Street, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>+234 (0) 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>support@deeskinstore.com</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4]"
                />
                <button className="bg-[#c6f2f4] text-[#0d0499] px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 DeeSkinStore. All rights reserved. | Terms of Service | Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;