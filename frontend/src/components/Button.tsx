import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "glass";
  as?: React.ElementType;
  className?: string;
} & (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" })
  | (Record<string, any> & { as?: React.ElementType })
);

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  as: Component = "button",
  className = "",
  "aria-label": ariaLabel,
  ...props
}) => {
  const base = "btn-base";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    glass: "btn-glass",
  };
  return (
    <Component
      className={`${base} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    />
  );
};

export default Button;
