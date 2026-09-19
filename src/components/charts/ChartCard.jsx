"use client";

import { useState } from "react";
import { Table2, BarChart3 } from "lucide-react";

/**
 * Card shell for a chart: title, subtitle, and a "Table" toggle that swaps the
 * chart for its accessible table twin (same data, no colour needed to read it).
 *
 * table: { columns: [{ key, label, align? }], rows: [{ ...values }] }
 */
export default function ChartCard({ title, subtitle, table, children, className = "", empty = false }) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className={`surface p-5 sm:p-6 flex flex-col ${className}`} aria-label={title}>
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {table && !empty && (
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40 ${
              showTable ? "bg-[#F4FFF3] text-[#5F8D4E]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
            aria-pressed={showTable}
          >
            {showTable ? <BarChart3 className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
            {showTable ? "Chart" : "Table"}
          </button>
        )}
      </header>

      {empty ? (
        <div className="flex-1 flex items-center justify-center py-10 text-sm text-gray-400">No data for this period</div>
      ) : showTable && table ? (
        <DataTable columns={table.columns} rows={table.rows} />
      ) : (
        <div className="flex-1 min-w-0">{children}</div>
      )}
    </section>
  );
}

export function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 ${c.align === "right" ? "text-right" : "text-left"} first:rounded-l-md last:rounded-r-md`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={`px-3 py-2 text-gray-700 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
