import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "text" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed gap-2";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20 border-none",
    secondary: "bg-brand-light text-brand-primary hover:bg-brand-primary/10 border-none",
    outline: "bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5",
    text: "bg-transparent text-text-secondary hover:text-brand-primary border-none p-0",
    danger: "bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20 border-none",
  };

  const sizes = {
    small: "px-3 py-1.5 text-xs rounded-lg",
    medium: "px-6 py-2.5 text-sm rounded-xl",
    large: "px-8 py-4 text-base rounded-2xl",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};
