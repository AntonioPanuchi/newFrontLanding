import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  as?: React.ElementType;
  className?: string;
} & (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' })
  | (Record<string, any> & { as?: React.ElementType })
);

const Button: React.FC<ButtonProps> = ({ variant = 'primary', as: Component = 'button', className = '', 'aria-label': ariaLabel, ...props }) => {
  const base = 'px-8 py-4 rounded-3xl font-bold transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-accent text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-wow focus:ring-4 focus:ring-accent/40',
    secondary: 'bg-white/80 border-2 border-accent text-accent hover:bg-blue-50 hover:scale-105 hover:shadow-wow focus:ring-4 focus:ring-accent/40',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 hover:shadow-wow focus:ring-4 focus:ring-accent/40',
    glass: 'bg-white/30 backdrop-blur-lg border border-white/40 text-primary hover:bg-white/50 hover:scale-105 hover:shadow-wow focus:ring-4 focus:ring-accent/40',
  };
  return (
    <Component className={`${base} ${variants[variant]} ${className}`} aria-label={ariaLabel} {...props} />
  );
};

export default Button; 