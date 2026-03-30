import React from "react";

interface DividerProps {
  className?: string;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  className = "",
  vertical = false,
}) => {
  if (vertical) {
    return <div className={`w-[1px] h-full bg-gray-100 mx-4 ${className}`} />;
  }
  return <div className={`h-[1px] w-full bg-gray-100 my-4 ${className}`} />;
};
