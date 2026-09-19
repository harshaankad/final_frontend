// components/Spinner.jsx
"use client";

import React from "react";

/**
 * Dot-ring spinner. `color` drives the dots (box-shadow uses currentColor),
 * so pass the brand green when it sits on a white surface.
 */
export default function Spinner({ color = "#fff" }) {
  return <div className="loader" style={{ ...loaderStyle, color }} role="status" aria-label="Loading" />;
}

const loaderStyle = {
  fontSize: "10px",
  width: "1em",
  height: "1em",
  borderRadius: "50%",
  position: "relative",
  textIndent: "-9999em",
  animation: "mulShdSpin 1.3s infinite linear",
  transform: "translateZ(0)",
};
