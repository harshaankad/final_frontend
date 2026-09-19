"use client";

import { useEffect, useRef, useState } from "react";

// Brand-derived chart palette. Series 1 is the brand green; series 2 (blue) was
// validated against it for colour-vision separation on a white surface.
export const CHART = {
  series: ["#5F8D4E", "#2a78d6"],
  seriesSoft: ["rgba(95,141,78,0.12)", "rgba(42,120,214,0.12)"],
  track: "#f3f4f6", // bar tracks / de-emphasis
  grid: "#e5e7eb",
  axis: "#d1d5db",
  ink: "#111827",
  inkSecondary: "#4b5563",
  inkMuted: "#6b7280",
  surface: "#ffffff",
};

/** Width of a container, kept in sync with resize. */
export function useContainerWidth(initial = 600) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.max(200, Math.round(el.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/**
 * Axis scale with clean steps (1/2/5 × 10^n). Returns the padded max and the tick
 * values, so integer data gets integer ticks (0, 2, 4…) instead of 0, 1.25, 2.5…
 */
export function niceScale(max, count = 4) {
  if (!max || max <= 0) return { max: count, ticks: Array.from({ length: count + 1 }, (_, i) => i) };
  const rough = max / count;
  const exp = Math.floor(Math.log10(rough));
  const base = Math.pow(10, exp);
  const f = rough / base;
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * base;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  return { max: top, ticks };
}

export const formatInt = (n) => new Intl.NumberFormat("en-IN").format(Math.round(n || 0));

export const formatINR = (n, { compact = false } = {}) => {
  const v = Math.round(n || 0);
  if (compact && v >= 100000) return `₹${(v / 100000).toFixed(v >= 1000000 ? 0 : 1)}L`;
  if (compact && v >= 1000) return `₹${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`;
  return `₹${new Intl.NumberFormat("en-IN").format(v)}`;
};

export const formatCompact = (n) => {
  const v = n || 0;
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`;
  return formatInt(v);
};

export const formatHours = (h) => {
  if (h == null) return "—";
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 48) return `${h.toFixed(h < 10 ? 1 : 0)} h`;
  return `${(h / 24).toFixed(1)} d`;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-19" → "19 Sep", "2026-09" → "Sep 26". */
export const formatBucket = (key, { long = false } = {}) => {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  if (d) return long ? `${d} ${MONTHS[m - 1]} ${y}` : `${d} ${MONTHS[m - 1]}`;
  return long ? `${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${String(y).slice(2)}`;
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const percentChange = (value, previous) => {
  if (previous == null || previous === 0) return value ? null : 0;
  return ((value - previous) / previous) * 100;
};
