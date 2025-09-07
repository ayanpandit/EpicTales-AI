import React from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';
// Import the library image
import libraryOwlImg from '../assets/library-owl-books.jpg';

const YourStoryBegins = () => {
  return (
    <section className="relative w-full h-screen flex flex-col">
      {/* Top Section with Text */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            Your Story Begins...
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide">
            The pages are waiting.
          </p>
        </div>
      </div>

      {/* Bottom Section with Library Image */}
      <div className="relative h-96 sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={libraryOwlImg}
            alt="Owl sitting on books in a magical library"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback gradient if image fails
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)';
              e.target.parentElement.innerHTML = `
                <div class="flex items-center justify-center h-full">
                  <div class="text-center text-white">
                    <div class="text-6xl mb-4">📚</div>
                    <div class="text-2xl font-bold">Library Scene</div>
                  </div>
                </div>
              `;
            }}
          />
          
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Footer Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              
              {/* Copyright */}
              <div className="text-white/90 text-sm sm:text-base font-light order-2 sm:order-1">
                © 2024 Storybook Adventures. All rights reserved.
              </div>

              {/* Links and Social Icons */}
              <div className="flex items-center space-x-6 sm:space-x-8 order-1 sm:order-2">
                {/* Footer Links */}
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <a 
                    href="#terms" 
                    className="text-white/90 hover:text-white text-sm sm:text-base font-light transition-colors duration-300 hover:underline"
                  >
                    Terms of Service
                  </a>
                  <a 
                    href="#privacy" 
                    className="text-white/90 hover:text-white text-sm sm:text-base font-light transition-colors duration-300 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <a 
                    href="#facebook" 
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                  
                  <a 
                    href="#twitter" 
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                  
                  <a 
                    href="#instagram" 
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Magical Sparkle Effects */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-amber-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-50 animate-pulse"></div>
      </div>

      {/* Additional floating animations for desktop */}
      <div className="hidden lg:block">
        {/* Floating book icons */}
        <div className="absolute top-20 left-10 text-gray-300 opacity-20 animate-bounce">
          <span className="text-4xl">📖</span>
        </div>
        <div className="absolute top-32 right-16 text-gray-300 opacity-15 animate-pulse">
          <span className="text-3xl">✨</span>
        </div>
        <div className="absolute top-40 left-1/4 text-gray-300 opacity-10 animate-bounce" style={{animationDelay: '1s'}}>
          <span className="text-2xl">📚</span>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        h1 {
          animation: fadeInUp 1s ease-out;
        }
        
        p {
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        /* Responsive text sizing with better scaling */
        @media (max-width: 640px) {
          h1 {
            font-size: 2.5rem;
            line-height: 1.2;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 2rem;
            line-height: 1.3;
          }
        }
      `}</style>
    </section>
  );
};

export default YourStoryBegins;