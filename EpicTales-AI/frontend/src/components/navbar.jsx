
import React, { useState } from 'react';
import { Menu, X, Home, Sparkles } from 'lucide-react';
import storybookLogo from '../assets/storybook-logo.png';

const CartoonishNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#', isActive: window.location.hash === '' || window.location.hash === '#', icon: Home },
    { name: 'Dashboard', href: '#dashboard', isActive: window.location.hash === '#dashboard', icon: Sparkles },
  ];

  return (
    <nav className="fixed top-4 left-0 w-full z-50 flex justify-center px-4">
      {/* Main Navbar */}
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg shadow-lg rounded-full border border-white/20 relative">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500 p-1 shadow-lg transition-transform duration-300 flex items-center justify-center">
                <img
                  src={storybookLogo}
                  alt="EpicTales-AI Logo"
                  className="w-full h-full object-contain rounded-full"
                  style={{ background: 'white' }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  EpicTales-AI
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                      item.isActive
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-white hover:bg-white/20 hover:text-orange-200'
                    }`}
                  >
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => window.location.hash = '#dashboard'}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300 uppercase tracking-wide"
              >
                Create Story
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 mt-2 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-4'
          } bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl mx-4`}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    item.isActive
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${
                    item.isActive ? 'text-white' : 'text-orange-500'
                  }`} />
                  <span className="text-base font-medium">{item.name}</span>
                  {item.isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </a>
              );
            })}
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-200">
              <button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.location.hash = '#dashboard';
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Create Story</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CartoonishNavbar;