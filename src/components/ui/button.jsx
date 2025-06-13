import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 bg-brandGreen text-[#FFFFFF] rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
