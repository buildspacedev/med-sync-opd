import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  multiline = false,
  className = "",
  rows = 3,
  ...props
}, ref) => {
  const widthStyle = fullWidth ? "w-full" : "";
  
  const inputStyles = `
    px-4 py-3 bg-white border border-gray-200 rounded-xl
    text-text-primary placeholder:text-text-tertiary
    transition-all duration-200
    focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error ? "border-error ring-error/10" : ""}
    ${className}
  `;

  return (
    <div className={`${widthStyle} flex flex-col gap-1.5`}>
      {label && (
        <label className="text-sm font-bold text-text-primary ml-1">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
          rows={rows}
          className={inputStyles}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          className={inputStyles}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className="text-xs text-error ml-1 font-medium">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
