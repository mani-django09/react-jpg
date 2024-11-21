import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    convert: [
      { name: 'JPG to PDF', link: '/jpg-to-pdf' },
      { name: 'Word to PDF', link: '/word-to-pdf' },
      { name: 'PowerPoint to PDF', link: '/ppt-to-pdf' },
      { name: 'Excel to PDF', link: '/excel-to-pdf' },
      { name: 'HTML to PDF', link: '/html-to-pdf' },
      { name: 'Markdown to PDF', link: '/markdown-to-pdf' }
    ],
    tools: [
      { name: 'Merge PDF', link: '/merge-pdf' },
      { name: 'Split PDF', link: '/split-pdf' },
      { name: 'Compress PDF', link: '/compress-pdf' },
      { name: 'PDF to Word', link: '/pdf-to-word' },
      { name: 'PDF to JPG', link: '/pdf-to-jpg' },
      { name: 'Add Page Numbers', link: '/add-page-numbers' }
    ],
    legal: [
      { name: 'Privacy Policy', link: '/privacy' },
      { name: 'Terms of Service', link: '/terms' },
      { name: 'Cookie Policy', link: '/cookies' },
      { name: 'GDPR', link: '/gdpr' },
      { name: 'Contact Us', link: '/contact' }
    ]
  };

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Convert to PDF Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              CONVERT TO PDF
            </h3>
            <ul className="space-y-3">
              {footerLinks.convert.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.link} 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              PDF TOOLS
            </h3>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.link} 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              LEGAL
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.link} 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">I</span>
                <span className="text-red-500 text-xl px-0.5">❤</span>
                <span className="text-xl font-bold">PDF</span>
              </Link>
              <span className="text-sm text-gray-600">© 2024 PDF Tools. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;