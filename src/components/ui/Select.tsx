import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[];
  error?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = true,
  className = "",
  ...props
}) => {
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <div className={`${widthStyle} flex flex-col gap-1.5`}>
      {label && (
        <label className="text-sm font-bold text-text-primary ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            appearance-none w-full px-4 py-3 bg-white border border-gray-200 rounded-xl
            text-text-primary transition-all duration-200
            focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error ? "border-error ring-error/10" : ""}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-tertiary">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <span className="text-xs text-error ml-1 font-medium">{error}</span>}
    </div>
  );
};
