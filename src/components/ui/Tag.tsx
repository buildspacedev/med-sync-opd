import React from "react";
import { X } from "lucide-react";

interface TagProps {
  children: React.ReactNode;
  color?: "cyan" | "green" | "blue" | "orange" | "red" | "gray";
  className?: string;
  closable?: boolean;
  onClose?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  color = "gray",
  className = "",
  closable = false,
  onClose,
}) => {
  const colors = {
    cyan: "bg-brand-light text-brand-primary border-brand-primary/10",
    green: "bg-success/10 text-success border-success/20",
    blue: "bg-info/10 text-info border-info/20",
    orange: "bg-warning/10 text-warning border-warning/20",
    red: "bg-error/10 text-error border-error/20",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border gap-1.5
        ${colors[color]}
        ${className}
      `}
    >
      {children}
      {closable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="hover:bg-black/5 rounded-full p-0.5 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};
