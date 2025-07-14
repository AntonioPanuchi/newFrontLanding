import React from 'react';

const Notification: React.FC = () => (
  <div className="fixed top-24 right-4 z-50 transition-transform duration-500 ease-in-out cursor-pointer">
    <div className="inline-flex items-center px-6 py-3 bg-white rounded shadow-lg">
      <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
      <span className="font-medium">🎉 Бесплатный пробный период!</span>
    </div>
  </div>
);

export default Notification; 