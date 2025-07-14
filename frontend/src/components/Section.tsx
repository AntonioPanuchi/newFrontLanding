import React from 'react';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => (
  <section className={`my-12 ${className}`}>
    <h2 className="text-3xl font-bold mb-6">{title}</h2>
    {children}
  </section>
);

export default Section; 