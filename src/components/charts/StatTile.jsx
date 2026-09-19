"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { CHART, percentChange } from "./utils";

/**
 * KPI tile: label, value, optional delta vs the previous period, optional sparkline.
 * `upIsGood` decides whether an increase is coloured as good (default) or bad
 * (e.g. backlog, turnaround).
 */
export default function StatTile({ label, value, rawValue, previous, hint, upIsGood = true, previousLabel, spark }) {
  const numeric = rawValue !== undefined ? rawValue : Number(value ?? 0);
  const pct = previous === undefined ? undefined : percentChange(numeric, previous);

  let delta = null;
  if (pct !== undefined) {
    if (pct === null) {
      delta = { text: "new", tone: "neutral", Icon: Minus };
    } else if (Math.abs(pct) < 0.5) {
      delta = { text: "0%", tone: "neutral", Icon: Minus };
    } else {
      const up = pct > 0;
      const good = up === upIsGood;
      delta = { text: `${up ? "+" : "−"}${Math.abs(pct).toFixed(0)}%`, tone: good ? "good" : "bad", Icon: up ? ArrowUpRight : ArrowDownRight };
    }
  }

  const toneClass = { good: "text-[#3d6330] bg-[#F4FFF3]", bad: "text-[#b42318] bg-[#fdf2f2]", neutral: "text-gray-500 bg-gray-100" };

  return (
    <div className="surface p-4 sm:p-5 flex flex-col gap-2 min-w-0">
      <div className="text-sm text-gray-500 truncate">{label}</div>
      <div className="flex items-end justify-between gap-3 min-w-0">
        <div className="text-2xl sm:text-[28px] font-semibold text-gray-900 leading-none whitespace-nowrap">{value ?? "—"}</div>
        {spark && spark.length > 1 && <Sparkline data={spark} />}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-h-[20px]">
        {delta && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${toneClass[delta.tone]}`}>
            <delta.Icon className="h-3 w-3" />
            {delta.text}
          </span>
        )}
        <span className="text-xs text-gray-400 leading-snug">{delta && previousLabel ? `vs ${previousLabel}` : hint}</span>
      </div>
    </div>
  );
}

function Sparkline({ data, width = 72, height = 24 }) {
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - (v / max) * (height - 2) - 1]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0 hidden sm:block" aria-hidden="true">
      <path d={d} fill="none" stroke={CHART.axis} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="3" fill={CHART.series[0]} stroke={CHART.surface} strokeWidth="1.5" />
    </svg>
  );
}
