import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  'Product': [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Templates', href: '/templates' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  'Company': [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  'Resources': [
    { name: 'Help Center', href: '/help-center' },
    { name: 'Documentation', href: '/documentation' },
    { name: 'Community', href: '/community' },
    { name: 'Changelog', href: '/changelog' },
  ],
  'Legal': [
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'GDPR', href: '/gdpr' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Instagram', href: '#', icon: Instagram },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-8 w-auto" src="/logo.svg" alt="Numinote Logo" />
              <span className="text-2xl font-bold tracking-tight">Numinote</span>
            </Link>
            <p className="text-gray-400 text-base">
              The all-in-one platform for nonprofit success.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-white">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Product</p>
                <ul className="mt-4 space-y-4">
                  {footerLinks.Product.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <p className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</p>
                <ul className="mt-4 space-y-4">
                  {footerLinks.Company.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Resources</p>
                <ul className="mt-4 space-y-4">
                  {footerLinks.Resources.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <p className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</p>
                <ul className="mt-4 space-y-4">
                  {footerLinks.Legal.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-base text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} Numinote. All rights reserved. Numinote is a product of Silver Mustard International LLC.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;