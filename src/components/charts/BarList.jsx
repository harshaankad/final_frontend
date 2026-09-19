"use client";

import { CHART, formatInt } from "./utils";

/**
 * Horizontal bar list for categories (top doctors, lesion sites, age bands…).
 * One hue for every bar; length is the only encoding. Values sit at the end of
 * each row, so nothing depends on colour or hover.
 *
 * items: [{ key, count, meta? }]
 */
export default function BarList({ items, format = formatInt, max, labelWidth = "w-32 sm:w-40", subtle }) {
  const top = max ?? Math.max(1, ...items.map((i) => i.count || 0));
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it) => {
        const pct = Math.max(0, Math.min(100, ((it.count || 0) / top) * 100));
        return (
          <li key={it.key} className="group flex items-center gap-3 text-sm" title={`${it.key}: ${format(it.count || 0)}`}>
            <span className={`${labelWidth} shrink-0 truncate text-gray-700`}>{it.key}</span>
            <span className="relative h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: CHART.track }}>
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 group-hover:brightness-110"
                style={{ width: `${pct}%`, background: CHART.series[0] }}
              />
            </span>
            <span className="w-14 shrink-0 text-right tabular-nums font-medium text-gray-900">{format(it.count || 0)}</span>
            {it.meta && <span className="hidden sm:inline w-20 shrink-0 text-right text-xs text-gray-400 tabular-nums">{it.meta}</span>}
          </li>
        );
      })}
      {subtle && <li className="text-xs text-gray-400 pt-1">{subtle}</li>}
    </ul>
  );
}
