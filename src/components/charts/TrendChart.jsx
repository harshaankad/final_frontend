"use client";

import { useState } from "react";
import { CHART, formatBucket, formatInt, niceScale, useContainerWidth } from "./utils";

/**
 * Line chart for one or more series over time buckets.
 *
 * data:   [{ date: "2026-09-19", <key>: number, ... }]
 * series: [{ key, label }]   (colour comes from slot order, never re-assigned)
 */
export default function TrendChart({ data, series, height = 260, format = formatInt, ariaLabel }) {
  const [ref, width] = useContainerWidth();
  const [hover, setHover] = useState(null);

  const m = { top: 12, right: 44, bottom: 26, left: 34 };
  const w = Math.max(width - m.left - m.right, 10);
  const h = height - m.top - m.bottom;
  const n = data.length;

  const rawMax = Math.max(0, ...data.flatMap((d) => series.map((s) => d[s.key] || 0)));
  const { max: yMax, ticks: yTicks } = niceScale(rawMax, 4);

  const x = (i) => (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v) => h - (v / yMax) * h;

  const path = (key) =>
    data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key] || 0).toFixed(1)}`).join(" ");
  const area = (key) => `${path(key)} L${x(n - 1).toFixed(1)},${h} L${x(0).toFixed(1)},${h} Z`;

  // As many x labels as fit at ~64px each (max 6), always including first and last
  const maxLabels = Math.max(2, Math.min(6, Math.floor(w / 64)));
  const labelEvery = Math.max(1, Math.ceil((n - 1) / (maxLabels - 1)));
  const xLabels = data.map((d, i) => i).filter((i) => i === n - 1 || (i % labelEvery === 0 && x(n - 1) - x(i) > 48));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - m.left;
    const i = n <= 1 ? 0 : Math.round((px / w) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  const hovered = hover != null ? data[hover] : null;
  const tipLeft = hovered ? m.left + x(hover) : 0;
  const tipOnLeft = tipLeft > width * 0.6;

  return (
    <div ref={ref} className="relative w-full select-none">
      {series.length > 1 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-gray-600" aria-label="Legend">
          {series.map((s, i) => (
            <li key={s.key} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded-full" style={{ background: CHART.series[i] }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        className="block overflow-visible"
      >
        <g transform={`translate(${m.left},${m.top})`}>
          {/* grid + y labels */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={0} x2={w} y1={y(t)} y2={y(t)} stroke={CHART.grid} strokeWidth="1" shapeRendering="crispEdges" />
              <text x={-8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={CHART.inkMuted}>
                {format(t)}
              </text>
            </g>
          ))}
          <line x1={0} x2={w} y1={h} y2={h} stroke={CHART.axis} strokeWidth="1" shapeRendering="crispEdges" />

          {/* x labels */}
          {xLabels.map((i) => (
            <text key={i} x={x(i)} y={h + 18} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="11" fill={CHART.inkMuted}>
              {formatBucket(data[i].date)}
            </text>
          ))}

          {/* area wash only for a single series */}
          {series.length === 1 && n > 1 && <path d={area(series[0].key)} fill={CHART.seriesSoft[0]} />}

          {/* lines */}
          {series.map((s, si) => (
            <path key={s.key} d={path(s.key)} fill="none" stroke={CHART.series[si]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          ))}

          {/* end markers + direct end labels */}
          {n > 0 &&
            series.map((s, si) => {
              const v = data[n - 1][s.key] || 0;
              return (
                <g key={s.key}>
                  <circle cx={x(n - 1)} cy={y(v)} r="4" fill={CHART.series[si]} stroke={CHART.surface} strokeWidth="2" />
                  <text x={x(n - 1) + 8} y={y(v)} dy="0.32em" fontSize="11" fontWeight="600" fill={CHART.inkSecondary}>
                    {format(v)}
                  </text>
                </g>
              );
            })}

          {/* crosshair */}
          {hovered && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={h} stroke={CHART.axis} strokeWidth="1" shapeRendering="crispEdges" />
              {series.map((s, si) => (
                <circle key={s.key} cx={x(hover)} cy={y(hovered[s.key] || 0)} r="4.5" fill={CHART.series[si]} stroke={CHART.surface} strokeWidth="2" />
              ))}
            </g>
          )}
        </g>
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md"
          style={tipOnLeft ? { right: width - tipLeft + 10 } : { left: tipLeft + 10 }}
          role="status"
        >
          <div className="mb-1 font-medium text-gray-500">{formatBucket(hovered.date, { long: true })}</div>
          {series.map((s, si) => (
            <div key={s.key} className="flex items-center gap-2 leading-5">
              <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: CHART.series[si] }} />
              <span className="font-semibold text-gray-900 tabular-nums">{format(hovered[s.key] || 0)}</span>
              <span className="text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
