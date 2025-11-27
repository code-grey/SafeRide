import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-xl border-b border-white/20 dark:border-accent-blue/20 z-50 shadow-soft dark:shadow-glow-blue transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-light-text dark:text-accent-blue text-2xl font-bold tracking-wider uppercase" style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(0, 243, 255, 0.5)' : 'none' }}>SafeRide</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/#overview" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Overview</a>
              <a href="/#features" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="/#demo" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Demo</a>
              <a href="/#contact" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
              <Link to="/login" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
              <button onClick={toggleTheme} className="p-2 rounded-full text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleTheme} className="p-2 rounded-full text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-light-subtle dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue transition-colors">
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-light-surface dark:bg-dark-surface border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/#overview" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Overview</a>
            <a href="/#features" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Features</a>
            <a href="/#demo" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Demo</a>
            <a href="/#contact" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Contact</a>
            <Link to="/login" className="text-light-subtle dark:text-gray-300 hover:text-accent-blue block px-3 py-2 rounded-md text-base font-medium transition-colors">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
