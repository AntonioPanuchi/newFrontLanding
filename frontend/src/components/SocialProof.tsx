import React from 'react';

const SocialProof: React.FC = () => (
  <section className="py-10 bg-white animate-fade-in-up">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8">
      <div className="flex items-center bg-white rounded-xl shadow-lg px-8 py-6 gap-4 border border-gray-100">
        <div className="flex -space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-md"></div>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full border-2 border-white shadow-md"></div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full border-2 border-white shadow-md"></div>
        </div>
        <span className="text-lg font-semibold text-gray-700">1,247+ активных пользователей</span>
      </div>
      <div className="flex items-center bg-white rounded-xl shadow-lg px-8 py-6 gap-4 border border-gray-100">
        <div className="flex text-yellow-400 text-2xl">★★★★★</div>
        <span className="text-lg font-semibold text-gray-700">4.8/5 рейтинг</span>
      </div>
    </div>
  </section>
);

export default SocialProof; 