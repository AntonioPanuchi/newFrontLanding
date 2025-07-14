import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const Card: React.FC<CardProps> = ({ children, className = '', style }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`} style={style}>
    {children}
  </div>
);

export default Card; 