import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`text-[#242424] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
