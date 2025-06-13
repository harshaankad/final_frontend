import React from "react";

export function Avatar({ children, className = "", ...props }) {
  return (
    <div
      className={`inline-block rounded-full bg-gray-300 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, ...props }) {
  return <img src={src} alt={alt} {...props} />;
}

export function AvatarFallback({ children, ...props }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-400 text-white" {...props}>
      {children}
    </div>
  );
}
