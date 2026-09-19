"use client";

import { useRef, useState, useEffect } from "react";

/**
 * N-digit code entry (email OTP, authenticator TOTP). Handles typing,
 * backspace, paste and auto-focus. Calls onChange with the joined string.
 */
export default function CodeInput({ length = 6, value = "", onChange, disabled = false, autoFocus = true }) {
  const [digits, setDigits] = useState(() => Array.from({ length }, (_, i) => value[i] || ""));
  const refs = useRef([]);

  // Let the parent clear the boxes (e.g. after a failed attempt).
  useEffect(() => {
    if (value === "") setDigits(Array(length).fill(""));
  }, [value, length]);

  const commit = (next) => {
    setDigits(next);
    onChange?.(next.join(""));
  };

  const handleChange = (e, i) => {
    const v = e.target.value;
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    commit(next);
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    commit(next);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex flex-row gap-2 sm:gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          maxLength="1"
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold text-gray-900 border border-gray-300 rounded-lg bg-white transition-colors duration-150 focus:outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/20 disabled:opacity-60"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
