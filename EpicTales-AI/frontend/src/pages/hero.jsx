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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/60 via-orange-100/60 to-red-100/60"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 h-full">
            {[...Array(128)].map((_, i) => (
              <div 
                key={i} 
                className="border-r border-b border-gray-200 opacity-20"
                style={{ minHeight: '60px' }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Center Character Only */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 sm:top-32 lg:top-40">
          <img 
            src={fairyTaleCharacterImg} 
            alt="Fairy Tale Character"
            className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 object-cover rounded-full shadow-lg"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-white/20">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Once <span className="italic">Upon a Time</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Embark on a magical journey where every page brings a new adventure. Meet a brave knight, a friendly dragon, a wise owl, and a smiling princess, all ready to leap from the pages and into your heart.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Reading
              </button>
              <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Explore Characters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--rotation, 0deg)); }
        }
        
        .absolute:nth-child(odd) {
          animation: float 6s ease-in-out infinite;
        }
        
        .absolute:nth-child(even) {
          animation: float 8s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default OnceUponTimeLanding;