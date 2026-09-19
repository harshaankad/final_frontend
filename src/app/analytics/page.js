"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Example from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import StatTile from "@/components/charts/StatTile";
import ChartCard, { DataTable } from "@/components/charts/ChartCard";
import TrendChart from "@/components/charts/TrendChart";
import ColumnChart from "@/components/charts/ColumnChart";
import BarList from "@/components/charts/BarList";
import { formatBucket, formatDate, formatHours, formatINR, formatInt } from "@/components/charts/utils";
import { API_BASE } from "@/lib/config";

const BASE_URL = API_BASE;

const RANGES = [
  { key: "30d", label: "Last 30 days", previous: "previous 30 days" },
  { key: "90d", label: "Last 90 days", previous: "previous 90 days" },
  { key: "12m", label: "Last 12 months", previous: "previous 12 months" },
  { key: "all", label: "All time", previous: null },
];

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function AnalyticsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [range, setRange] = useState("30d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("authToken") || localStorage.getItem("token") : null;

  // Admin-only: anyone else is sent to their patients list.
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch(`${BASE_URL}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("authToken");
          router.replace("/login");
          return;
        }
        const d = await res.json();
        if (res.ok && d?.user?.role === "admin") setAuthorized(true);
        else router.replace("/patients");
      })
      .catch(() => router.replace("/patients"));
  }, [router]);

  const load = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/admin-analytics?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.message || d.error || "Failed to load analytics");
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    if (authorized) load();
  }, [authorized, load]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F8D4E] mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const current = RANGES.find((r) => r.key === range);
  const k = data?.kpis;
  const series = data?.series || [];
  const b = data?.breakdowns;

  const openPatient = (row) => router.push(row.status === "Pending" ? `/generate-report/${row.id}` : `/report/${row.id}`);

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="w-full mb-6 sm:mb-8 lg:mb-10">
        <Example />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between mb-4 sm:mb-6 px-4 sm:px-8 lg:px-20 gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Analytics</h1>
          <p className="text-sm text-gray-500 leading-tight">
            {data ? `${formatBucket(series[0]?.date, { long: true })} – ${formatDate(data.range.to)}` : "Submissions, reports and revenue"}
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* Range filter — scopes everything below */}
      <div className="flex gap-2 sm:gap-3 mb-6 px-4 sm:px-8 lg:px-20 overflow-x-auto" role="tablist" aria-label="Date range">
        {RANGES.map((r) => (
          <button
            key={r.key}
            role="tab"
            aria-selected={range === r.key}
            onClick={() => setRange(r.key)}
            className={`h-10 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5F8D4E]/40 ${
              range === r.key ? "bg-[#F4FFF3] text-[#5F8D4E]" : "bg-transparent text-gray-500 hover:text-[#5F8D4E] hover:bg-gray-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className={`flex flex-col gap-6 px-4 sm:px-8 lg:px-20 pb-12 transition-opacity duration-200 ${loading && data ? "opacity-60" : ""}`}>
        {!data ? (
          <KpiSkeleton />
        ) : (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4">
              <StatTile
                label="Submissions"
                value={formatInt(k.submissions.value)}
                rawValue={k.submissions.value}
                previous={current.previous ? k.submissions.previous : undefined}
                previousLabel={current.previous}
                hint={k.unpaid.value ? `${formatInt(k.unpaid.value)} started but unpaid` : "paid patient cases"}
                spark={series.map((s) => s.submissions)}
              />
              <StatTile
                label="Reports completed"
                value={formatInt(k.completed.value)}
                rawValue={k.completed.value}
                previous={current.previous ? k.completed.previous : undefined}
                previousLabel={current.previous}
                hint="reports generated"
                spark={series.map((s) => s.completed)}
              />
              <StatTile
                label="Pending backlog"
                value={formatInt(k.backlog.value)}
                hint="awaiting a report right now"
              />
              <StatTile
                label="Revenue"
                value={formatINR(k.revenue.value)}
                rawValue={k.revenue.value}
                previous={current.previous ? k.revenue.previous : undefined}
                previousLabel={current.previous}
                hint="from completed payments"
                spark={series.map((s) => s.revenue)}
              />
              <StatTile
                label="Median turnaround"
                value={formatHours(k.turnaround.medianHours)}
                rawValue={k.turnaround.medianHours ?? 0}
                previous={current.previous && k.turnaround.previousMedianHours != null ? k.turnaround.previousMedianHours : undefined}
                previousLabel={current.previous}
                upIsGood={false}
                hint={k.turnaround.samples ? `payment → report · avg ${formatHours(k.turnaround.avgHours)}` : "no reports in this period"}
              />
              <StatTile
                label="Active doctors"
                value={formatInt(k.doctors.active)}
                hint={`of ${formatInt(k.doctors.total)} registered${k.doctors.newInRange ? ` · ${formatInt(k.doctors.newInRange)} new` : ""}`}
              />
            </div>

            {/* Trend */}
            <ChartCard
              title="Submissions and reports over time"
              subtitle={data.range.bucket === "day" ? "Per day" : "Per month"}
              empty={!series.some((s) => s.submissions || s.completed)}
              table={{
                columns: [
                  { key: "date", label: "Date" },
                  { key: "submissions", label: "Submissions", align: "right" },
                  { key: "completed", label: "Reports", align: "right" },
                ],
                rows: series.map((s) => ({ date: formatBucket(s.date, { long: true }), submissions: s.submissions, completed: s.completed })),
              }}
            >
              <TrendChart
                data={series}
                series={[
                  { key: "submissions", label: "Submissions" },
                  { key: "completed", label: "Reports completed" },
                ]}
                ariaLabel="Submissions and reports completed over time"
              />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Revenue"
                subtitle={`${formatINR(k.revenue.value)} in this period`}
                empty={!series.some((s) => s.revenue)}
                table={{
                  columns: [
                    { key: "date", label: "Date" },
                    { key: "revenue", label: "Revenue", align: "right" },
                  ],
                  rows: series.map((s) => ({ date: formatBucket(s.date, { long: true }), revenue: formatINR(s.revenue) })),
                }}
              >
                <ColumnChart data={series.map((s) => ({ label: s.date, value: s.revenue }))} format={(v) => formatINR(v, { compact: true })} ariaLabel="Revenue over time" />
              </ChartCard>

              <ChartCard
                title="Turnaround time"
                subtitle="Payment to report, for reports completed in this period"
                empty={!k.turnaround.samples}
                table={{
                  columns: [
                    { key: "key", label: "Turnaround" },
                    { key: "count", label: "Reports", align: "right" },
                  ],
                  rows: b.turnaroundBuckets,
                }}
              >
                <ColumnChart data={b.turnaroundBuckets.map((t) => ({ label: t.key, value: t.count }))} isTime={false} ariaLabel="Reports by turnaround time" />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Top doctors"
                subtitle="By submissions in this period"
                empty={!b.doctors.length}
                table={{
                  columns: [
                    { key: "name", label: "Doctor" },
                    { key: "submissions", label: "Submissions", align: "right" },
                    { key: "completed", label: "Completed", align: "right" },
                    { key: "revenue", label: "Revenue", align: "right" },
                  ],
                  rows: b.doctors.map((d) => ({ ...d, revenue: formatINR(d.revenue) })),
                }}
              >
                <BarList items={b.doctors.map((d) => ({ key: d.name, count: d.submissions, meta: `${d.completed} done` }))} />
              </ChartCard>

              <ChartCard
                title="Sites of lesion"
                subtitle="Most common regions submitted"
                empty={!b.sites.length}
                table={{
                  columns: [
                    { key: "key", label: "Site" },
                    { key: "count", label: "Patients", align: "right" },
                  ],
                  rows: b.sites,
                }}
              >
                <BarList items={b.sites} />
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Patient demographics"
                subtitle="Paid submissions in this period"
                empty={!b.gender.length && !b.ageBands.length}
                table={{
                  columns: [
                    { key: "group", label: "Group" },
                    { key: "key", label: "Value" },
                    { key: "count", label: "Patients", align: "right" },
                  ],
                  rows: [
                    ...b.gender.map((g) => ({ group: "Gender", key: capitalize(g.key), count: g.count })),
                    ...b.ageBands.map((a) => ({ group: "Age", key: a.key, count: a.count })),
                  ],
                }}
              >
                <div className="flex flex-col gap-5">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2.5">Gender</h4>
                    <BarList items={b.gender.map((g) => ({ ...g, key: capitalize(g.key) }))} labelWidth="w-20" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2.5">Age</h4>
                    <BarList items={b.ageBands} labelWidth="w-20" />
                  </div>
                </div>
              </ChartCard>

              <ChartCard
                title="How doctors heard about us"
                subtitle="All registered doctors"
                empty={!b.referral.length}
                table={{
                  columns: [
                    { key: "key", label: "Source" },
                    { key: "count", label: "Doctors", align: "right" },
                  ],
                  rows: b.referral,
                }}
              >
                <BarList items={b.referral} labelWidth="w-40 sm:w-48" />
              </ChartCard>
            </div>

            {/* Recent submissions */}
            <section className="surface p-5 sm:p-6" aria-label="Recent submissions">
              <header className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 leading-tight">Recent submissions</h3>
                <p className="text-sm text-gray-500 mt-0.5">Latest paid cases in this period</p>
              </header>
              {data.recent.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">No submissions in this period</div>
              ) : (
                <div className="overflow-x-auto -mx-1">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 rounded-l-md">Patient</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Doctor</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hidden sm:table-cell">Date</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 hidden sm:table-cell">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 rounded-r-md">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.recent.map((r) => (
                        <tr key={r.id} onClick={() => openPatient(r)} className="cursor-pointer transition-colors hover:bg-[#F4FFF3]/50">
                          <td className="px-3 py-2.5 font-medium text-gray-900">{r.patient}</td>
                          <td className="px-3 py-2.5 text-gray-700">{r.doctor}</td>
                          <td className="px-3 py-2.5 text-gray-500 hidden sm:table-cell">{formatDate(r.date)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-gray-700 hidden sm:table-cell">{formatINR(r.amount)}</td>
                          <td className="px-3 py-2.5">
                            <Badge className={r.status === "Completed" ? "bg-[#F4FFF3] text-[#5F8D4E]" : "bg-[#ffe2e5] text-[#f64e60]"}>{r.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="surface p-5 flex flex-col gap-3">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-7 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}
