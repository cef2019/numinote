import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img className="h-8 w-auto" alt="Numinote Logo" src="/logo.svg" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Numinote</span>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                Get Started Free <ChevronsRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-5 flex flex-col space-y-3">
                <Button asChild variant="outline" onClick={() => setIsMenuOpen(false)}>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicHeader;