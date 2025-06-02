import { Bluetooth as Tooth } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Upload Scan', path: '/upload' },
    { name: 'View History', path: '/history' },
    { name: 'Learn', path: '/learn' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Tooth size={32} className="text-primary-600" />
              <span className="text-2xl font-bold text-primary-600">Neo Dental</span>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              AI-powered dental disease detection for better oral health care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-600 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact</h3>
            <p className="text-gray-600 text-base mb-4">
              Have questions? Reach out to us.
            </p>
            <a
              href="mailto:contact@neodental.com"
              className="text-primary-600 hover:text-primary-700 text-base font-medium"
            >
              contact@neodental.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-gray-600 text-base">
            © {currentYear} Neo Dental. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;