import React from 'react';

const FloatingParticles: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-0">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="particle" />
    ))}
    {/* Добавьте стили для .particle в index.css или через Tailwind */}
  </div>
);

export default FloatingParticles; 