"use client";

import { useState } from "react";
import { CHART, formatBucket, formatInt, niceScale, useContainerWidth } from "./utils";

/**
 * Single-series column chart. Columns are ≤ 24px, rounded at the top, square at
 * the baseline, with a 2px surface gap between neighbours. Each column is its own
 * hover target.
 *
 * data: [{ label, value }]  — `label` is a bucket key ("2026-09-19") when isTime,
 * otherwise plain text.
 */
export default function ColumnChart({ data, height = 240, format = formatInt, isTime = true, ariaLabel }) {
  const [ref, width] = useContainerWidth();
  const [hover, setHover] = useState(null);

  const n = data.length;
  const plotW = Math.max(width - 48, 10);
  // Category labels that would collide are staggered onto two rows instead of dropped.
  const stagger = !isTime && n > 1 && plotW / n < 80;
  const m = { top: 12, right: 8, bottom: stagger ? 40 : 26, left: 40 };
  const w = Math.max(width - m.left - m.right, 10);
  const h = height - m.top - m.bottom;

  const { max: yMax, ticks: yTicks } = niceScale(Math.max(0, ...data.map((d) => d.value || 0)), 4);
  const y = (v) => h - (v / yMax) * h;

  const slot = n ? w / n : w;
  const barW = Math.max(2, Math.min(24, slot - 2));
  const xOf = (i) => i * slot + (slot - barW) / 2;

  // Time buckets: as many labels as fit at ~64px each. Categories: every label if the
  // slot is wide enough, otherwise every other one.
  const maxLabels = Math.max(2, Math.min(6, Math.floor(w / 64)));
  const labelEvery = isTime ? Math.max(1, Math.ceil((n - 1) / (maxLabels - 1))) : 1;
  const xLabels = data.map((_, i) => i).filter((i) => i === n - 1 || (i % labelEvery === 0 && (!isTime ? true : xOf(n - 1) - xOf(i) > 48)));

  const roundedTop = (x, top, wdt, bottom) => {
    const r = Math.min(4, wdt / 2, Math.max(0, bottom - top));
    return `M${x},${bottom} V${top + r} Q${x},${top} ${x + r},${top} H${x + wdt - r} Q${x + wdt},${top} ${x + wdt},${top + r} V${bottom} Z`;
  };

  const hovered = hover != null ? data[hover] : null;
  const tipLeft = hovered ? m.left + xOf(hover) + barW / 2 : 0;
  const tipOnLeft = tipLeft > width * 0.6;

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} className="block overflow-visible" onPointerLeave={() => setHover(null)}>
        <g transform={`translate(${m.left},${m.top})`}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke={CHART.grid} strokeWidth="1" shapeRendering="crispEdges" />
              <text x={-8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={CHART.inkMuted}>
                {format(t)}
              </text>
            </g>
          ))}
          <line x1={0} x2={w} y1={h} y2={h} stroke={CHART.axis} strokeWidth="1" shapeRendering="crispEdges" />

          {xLabels.map((i) => (
            <text
              key={i}
              x={xOf(i) + barW / 2}
              y={h + 18 + (stagger && i % 2 ? 14 : 0)}
              textAnchor={isTime ? (i === 0 ? "start" : i === n - 1 ? "end" : "middle") : "middle"}
              fontSize="11"
              fill={CHART.inkMuted}
            >
              {isTime ? formatBucket(data[i].label) : data[i].label}
            </text>
          ))}

          {data.map((d, i) => {
            const v = d.value || 0;
            const top = y(v);
            const active = hover === i;
            return (
              <g key={i}>
                {v > 0 && <path d={roundedTop(xOf(i), top, barW, h)} fill={CHART.series[0]} opacity={hover == null || active ? 1 : 0.55} />}
                {/* hit target spans the whole slot so small bars are easy to hover */}
                <rect x={i * slot} y={0} width={slot} height={h} fill="transparent" onPointerEnter={() => setHover(i)} />
              </g>
            );
          })}
        </g>
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md"
          style={tipOnLeft ? { right: width - tipLeft + 10 } : { left: tipLeft + 10 }}
          role="status"
        >
          <div className="mb-0.5 font-medium text-gray-500">{isTime ? formatBucket(hovered.label, { long: true }) : hovered.label}</div>
          <div className="font-semibold text-gray-900 tabular-nums">{format(hovered.value || 0)}</div>
        </div>
      )}
    </div>
  );
}
