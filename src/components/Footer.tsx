import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="w-8 h-8 text-green-400" />
              <span className="text-xl font-bold">ZimbabweApps</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Zimbabwe's premier mobile app marketplace. Discover, download, and support local developers 
              creating innovative solutions for our digital future.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Harare, Zimbabwe</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/apps" className="hover:text-green-400 transition-colors">
                  Browse Apps
                </Link>
              </li>
              <li>
                <Link to="/developer" className="hover:text-green-400 transition-colors">
                  Developer Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Payment Info
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 ZimbabweApps. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <span>support@zimbabweapps.co.zw</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;