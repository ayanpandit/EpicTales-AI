import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import readingFamilyImg from '../assets/reading-family.jpg';
import emilyAvatarImg from '../assets/emily-avatar.jpg';
import davidAvatarImg from '../assets/david-avatar.jpg';
import sophiaAvatarImg from '../assets/sophia-avatar.jpg';

const FamilyTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Emily Carter",
      date: "May 15, 2024",
      rating: 5,
      review: "My kids absolutely adore the stories! The illustrations are captivating, and the narratives are both fun and educational. It's become a nightly ritual we all look forward to.",
      likes: 12,
      dislikes: 2,
  avatar: emilyAvatarImg
    },
    {
      id: 2,
      name: "David Lee",
      date: "April 22, 2024",
      rating: 5,
      review: "The app is fantastic! It's easy to use, and the variety of stories keeps my children engaged. I love that it encourages a love for reading in such a fun way.",
      likes: 15,
      dislikes: 1,
  avatar: davidAvatarImg
    },
    {
      id: 3,
      name: "Sophia Green",
      date: "March 10, 2024",
      rating: 4,
      review: "We enjoy the stories, but sometimes the app can be a bit slow. Overall, it's a great resource for kids, and the content is top-notch.",
      likes: 8,
      dislikes: 3,
  avatar: sophiaAvatarImg
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-orange-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-20">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
            TESTIMONIALS
          </span>
        </div>
        
        {/* Hero Image */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <img 
              src={readingFamilyImg} 
              alt="Family reading together"
              className="w-full max-w-2xl h-64 sm:h-80 lg:h-96 xl:h-[28rem] object-cover rounded-3xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl border-4 border-orange-200/50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
          </div>
        </div>
        
        {/* Title and Description */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-orange-500 mb-8 leading-tight">
            <span className="font-['Brush_Script_MT',_cursive] italic">
              What Our Families Say
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover why families love our magical storybooks. Read testimonials from parents and children who have experienced the joy of reading with us.
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-2xl transition-shadow duration-300 border border-gray-200"
            >
              {/* User Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-semibold text-lg mr-4 flex-shrink-0">
                  <img 
                    src={testimonial.avatar} 
                    alt={`${testimonial.name} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <span className="hidden items-center justify-center w-full h-full">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {testimonial.date}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                "{testimonial.review}"
              </p>

              {/* Like/Dislike Section */}
              <div className="flex items-center justify-start space-x-6 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors duration-200">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{testimonial.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200">
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm font-medium">{testimonial.dislikes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles for Script Font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap');
      `}</style>
    </div>
  );
};

export default FamilyTestimonials;