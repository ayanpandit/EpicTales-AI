import React from 'react';
import storyWritingImg from '../assets/story-writing-feature.jpg';
import illustrationsImg from '../assets/illustrations-feature.jpg';
import customizableCharactersImg from '../assets/customizable-characters-feature.jpg';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "AI Story Writing",
      description: "Watch as your child's ideas transform into captivating stories with our AI-powered writing tool. The magical quill brings their imagination to life.",
      image: storyWritingImg,
      altText: "AI Story Writing Feature"
    },
    {
      id: 2,
      title: "Illustrations",
      description: "Our cheerful painter fairy helps create vibrant, playful scenes with smiling characters, making each story visually stunning and engaging.",
      image: illustrationsImg,
      altText: "Illustrations Feature"
    },
    {
      id: 3,
      title: "Customizable Characters",
      description: "Children can choose their favorite cartoon characters from our magical library of creatures, adding a personal touch to every story.",
      image: customizableCharactersImg,
      altText: "Customizable Characters Feature"
    }
  ];

  return (
    <section className="w-full bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
              FEATURES
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
            <span className="font-['Brush_Script_MT',_cursive] italic">
              Magical Features to Spark Creativity
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Explore the enchanting features of our storybook app, designed to spark creativity and bring stories to life.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="text-center group"
            >
              {/* Feature Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200">
                {/* Image Container */}
                <div className="relative mb-8">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto rounded-full overflow-hidden shadow-2xl transition-transform duration-300 ease-out">
                    <img 
                      src={feature.image}
                      alt={feature.altText}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback based on feature type
                        if (feature.id === 1) {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23064e3b;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23065f46;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23grad1)'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23d1fae5' font-size='60'%3E✍️%3C/text%3E%3C/svg%3E";
                        } else if (feature.id === 2) {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23059669;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='200' r='200' fill='url(%23grad2)'/%3E%3Ctext x='200' y='230' text-anchor='middle' fill='white' font-size='80'%3E🎨%3C/text%3E%3C/svg%3E";
                        } else {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23065f46;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23047857;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='200' cy='200' r='200' fill='url(%23grad3)'/%3E%3Ctext x='200' y='230' text-anchor='middle' fill='%23d1fae5' font-size='80'%3E👥%3C/text%3E%3C/svg%3E";
                        }
                      }}
                    />
                  </div>
                  
                  {/* Feature Number Badge */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white">
                      {feature.id}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-sm mx-auto font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 uppercase tracking-wide hover:shadow-2xl">
            Explore All Features
          </button>
        </div>
      </div>

      {/* Custom Styles for Script Font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap');
      `}</style>
    </section>
  );
};

export default FeaturesSection;