import React from 'react';
import openBookImg from '../assets/open-book.png';
import fairyTaleCharacterImg from '../assets/fairy-tale-character.png';
import magicLampImg from '../assets/magic-lamp.png';
import wiseOwlImg from '../assets/wise-owl.png';
import natureSceneImg from '../assets/nature-scene.jpg';
import openBook2Img from '../assets/open-book-2.png';
import backImg from '../assets/back.jpg';

const OnceUponTimeLanding = () => {
  return (
    <div className="min-h-screen relative overflow-hidden gpu-accelerated" style={{backgroundImage: `url(${backImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}>
      {/* Overlay removed as requested */}      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none will-change-transform">
        {/* Top Center Character Only */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 sm:top-32 lg:top-40 will-change-transform">
          <img 
            src={fairyTaleCharacterImg} 
            alt="Fairy Tale Character"
            className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 object-cover rounded-full shadow-lg smooth-transition"
            loading="lazy"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='128' viewBox='0 0 112 128'%3E%3Ccircle cx='56' cy='64' r='56' fill='%23fbbf24'/%3E%3Ctext x='56' y='80' text-anchor='middle' fill='white' font-size='40'%3E🧚‍♀️%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>

      {/* Main Content */}
  <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-white/30 glass-card gpu-accelerated">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-6 sm:mb-8 leading-tight drop-shadow-lg will-change-transform">
              <span className="text-white animate-fade-in-bright">Once</span>{' '}
              <span className="italic text-transparent bg-gradient-to-r from-orange-300 via-yellow-400 to-orange-500 bg-clip-text animate-pulse-bright animate-fade-in-bright-delay">
                Upon a Time
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Embark on a magical journey where every page brings a new adventure. Meet a brave knight, a friendly dragon, a wise owl, and a smiling princess, all ready to leap from the pages and into your heart.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => window.location.hash = '#dashboard'}
                className="w-full sm:w-auto bg-orange-500/80 hover:bg-orange-600/90 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-orange-400/30 will-change-transform"
              >
                Start Making Your Story
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(var(--rotation, 0deg)) translateZ(0); 
          }
          50% { 
            transform: translateY(-10px) rotate(var(--rotation, 0deg)) translateZ(0); 
          }
        }
        
        .absolute:nth-child(odd) {
          animation: float 6s ease-in-out infinite;
          will-change: transform;
        }
        
        .absolute:nth-child(even) {
          animation: float 8s ease-in-out infinite 2s;
          will-change: transform;
        }

        .glass-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
          will-change: backdrop-filter;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          .absolute:nth-child(odd),
          .absolute:nth-child(even) {
            animation: none;
          }
        }

        /* Custom bright fade animations */
        @keyframes fade-in-bright {
          0% {
            opacity: 0;
            filter: brightness(0.5) blur(2px);
            transform: translateY(20px) scale(0.95);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.2) blur(1px);
            transform: translateY(10px) scale(0.98);
          }
          100% {
            opacity: 1;
            filter: brightness(1.1) blur(0px);
            transform: translateY(0px) scale(1);
          }
        }

        @keyframes pulse-bright {
          0%, 100% {
            filter: brightness(1.1) drop-shadow(0 0 20px rgba(255, 183, 77, 0.6));
          }
          50% {
            filter: brightness(1.3) drop-shadow(0 0 30px rgba(255, 183, 77, 0.8));
          }
        }

        .animate-fade-in-bright {
          animation: fade-in-bright 2s ease-out forwards;
        }

        .animate-fade-in-bright-delay {
          animation: fade-in-bright 2s ease-out 0.5s forwards, pulse-bright 3s ease-in-out 2.5s infinite;
          opacity: 0;
        }

        .animate-pulse-bright {
          animation: pulse-bright 3s ease-in-out infinite;
        }
      `}</style>
      </div>
  );
};

export default OnceUponTimeLanding;