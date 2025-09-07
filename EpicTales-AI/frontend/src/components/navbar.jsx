
import React, { useState } from 'react';
import { Menu, X, BookOpen, Sparkles, Users, Star, Heart } from 'lucide-react';
import storybookLogo from '../assets/storybook-logo.png';

const CartoonishNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#', isActive: true, icon: BookOpen },
    { name: 'Features', href: '#features', icon: Sparkles },
    { name: 'Stories', href: '#stories', icon: BookOpen },
    { name: 'Characters', href: '#characters', icon: Users },
    { name: 'About', href: '#about', icon: Star },
  ];

  return (
    <nav className="fixed top-4 left-0 w-full z-50 flex justify-center">
      {/* Main Navbar */}
      <div className="w-4/5 bg-white/10 backdrop-blur-lg shadow-lg rounded-full border border-white/20 flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
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
            <div className="hidden sm:flex items-center space-x-3">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-lg transition-all duration-300 uppercase tracking-wide">
                Start Reading
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          } overflow-hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 rounded-b-3xl`}
        >
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center space-x-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    item.isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isMenuOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none'
                  }}
                >
                  <div className={`p-2 rounded-xl ${
                    item.isActive 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      item.isActive ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-base font-medium">{item.name}</span>
                  </div>
                  {item.isActive && (
                    <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
                  )}
                </a>
              );
            })}
            
            {/* Mobile CTA */}
            <div className="pt-6 border-t border-gray-100">
              <button 
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-base">Start Reading</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Mobile Menu Footer */}
            <div className="pt-4 text-center">
              <p className="text-xs text-gray-500">Where stories come alive ✨</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Script Font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap');
      `}</style>
    </nav>
  );
};

export default CartoonishNavbar;