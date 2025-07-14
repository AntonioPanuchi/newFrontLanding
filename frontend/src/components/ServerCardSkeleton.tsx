import React from 'react';

const ServerCardSkeleton = () => (
  <div className="relative flex flex-col items-center min-h-[280px] sm:min-h-[360px] bg-gray-100 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-pulse px-6 sm:px-10 md:px-14 py-8 sm:py-12">
    <div className="w-20 h-6 bg-gray-200 rounded mb-4" />
    <div className="w-32 h-8 bg-gray-200 rounded mb-4" />
    <div className="w-16 h-6 bg-gray-200 rounded mb-2" />
    <div className="w-full h-3 bg-gray-200 rounded-full my-2" />
    <div className="w-full h-3 bg-gray-200 rounded-full my-2" />
    <div className="w-24 h-6 bg-gray-200 rounded mt-4" />
  </div>
);

export default ServerCardSkeleton; 