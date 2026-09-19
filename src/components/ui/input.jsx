import React from "react";

export function Input({ className = "", ...props }) {
  return <input className={`field-input ${className}`} {...props} />;
}
