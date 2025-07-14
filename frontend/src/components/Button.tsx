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

const Button: React.FC<ButtonProps> = ({ variant = 'primary', as: Component = 'button', className = '', ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  return (
    <Component className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
};

export default Button; 