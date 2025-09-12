// components/Spinner.jsx
"use client";

import React from "react";

export default function Spinner() {
  return (
    <div className="loader" style={loaderStyle}></div>
  );
}

const loaderStyle = {
  color: "#fff",
  fontSize: "10px",
  width: "1em",
  height: "1em",
  borderRadius: "50%",
  position: "relative",
  textIndent: "-9999em",
  animation: "mulShdSpin 1.3s infinite linear",
  transform: "translateZ(0)"
};

// Add keyframes to global styles (see below)
