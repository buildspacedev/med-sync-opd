import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  noPadding = false,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-3xl border border-gray-100 shadow-sm
        ${noPadding ? "" : "p-6 md:p-8"}
        ${hoverable ? "hover:shadow-md transition-shadow duration-200 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
