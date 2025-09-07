import React from 'react';

const testimonials = [
  {
    name: 'Ava (Parent)',
    text: 'EpicTales-AI has made bedtime stories magical! My kids love creating their own adventures and seeing them come to life.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Leo (Teacher)',
    text: 'A wonderful tool for sparking creativity in the classroom. The AI stories and illustrations are a hit with my students!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Maya (Child)',
    text: 'I made a story about a dragon and a princess! It was so much fun and the pictures were beautiful.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

const TestimonialSection = () => (
  <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-yellow-50 via-pink-50 to-red-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-red-700 mb-4">Testimonials</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">See what parents, teachers, and kids are saying about EpicTales-AI!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-red-100">
            <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 shadow-md object-cover" />
            <p className="text-lg text-gray-700 italic mb-4">"{t.text}"</p>
            <span className="font-semibold text-red-600">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;
