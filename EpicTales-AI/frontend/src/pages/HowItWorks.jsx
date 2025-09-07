import React from 'react';
// Use web-based images for steps
const stepOneImg = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
const stepTwoImg = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
const stepThreeImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Step 1: Enter Your Idea",
      description: "Describe your story idea, including characters, settings, and plot points. Let your imagination run wild!",
      image: stepOneImg,
      alt: "Person thinking with creative ideas floating around"
    },
    {
      id: 2,
      title: "Step 2: AI Writes & Illustrates", 
      description: "Our AI generates a unique story and illustrations based on your input, bringing your vision to life.",
      image: stepTwoImg,
      alt: "AI robot creating stories and illustrations"
    },
    {
      id: 3,
      title: "Step 3: Enjoy Your Story",
      description: "Receive your personalized storybook, ready to be read and enjoyed. Watch your characters come to life!",
      image: stepThreeImg,
      alt: "Family enjoying a personalized storybook together"
    }
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
              HOW IT WORKS
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-orange-500 mb-8 leading-tight">
            <span className="font-['Brush_Script_MT',_cursive] italic">
              Crafting Your Story in Three Simple Steps
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
            Unleash your creativity and watch your ideas transform into captivating stories with our easy-to-use platform. It's as simple as one, two, three!
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="text-center group"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              {/* Image Container */}
              <div className="relative mb-8">
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto rounded-full overflow-hidden shadow-2xl transition-transform duration-300 ease-out">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback gradient background if image fails
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = `linear-gradient(135deg, ${
                        index === 0 ? '#86efac, #22d3ee' :
                        index === 1 ? '#a78bfa, #ec4899' :
                        '#fbbf24, #f97316'
                      })`;
                      e.target.parentElement.innerHTML = `<div class="flex items-center justify-center h-full text-white text-6xl font-bold">${step.id}</div>`;
                    }}
                  />
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white">
                    {step.id}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-sm mx-auto font-medium">
                  {step.description}
                </p>
              </div>

              {/* Connecting Line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-32 left-full w-12 transform -translate-y-1/2">
                  <div className="h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-orange-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles for Script Font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap');
        
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
        
        .group {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .group:hover .transition-transform {
          transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
          .group {
            animation-delay: 0ms !important;
          }
        }
        
        /* Custom positioning for connecting arrows */
        @media (min-width: 1024px) {
          .grid > div:nth-child(1) .absolute {
            left: calc(100% - 2rem);
          }
          .grid > div:nth-child(2) .absolute {
            left: calc(100% - 2rem);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;