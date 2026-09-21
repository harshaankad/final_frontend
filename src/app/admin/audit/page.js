"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Example from "@/components/navbar";
import Spinner from "@/components/Spinner";
import { apiFetch, isLoggedIn } from "@/lib/auth";

// Who did what, when, from where. Newest first; "Load more" pages backwards.
const ACTIONS = [
  ["", "All events"],
  ["login.success", "Sign-in"],
  ["login.failed", "Failed sign-in"],
  ["login.locked", "Account locked"],
  ["mfa.enabled", "MFA enabled"],
  ["mfa.disabled", "MFA disabled"],
  ["mfa.verify_failed", "MFA code failed"],
  ["patient.viewed", "Patient viewed"],
  ["patient.created", "Patient created"],
  ["patient.deleted", "Patient deleted"],
  ["report.generated", "Report generated"],
  ["payment.verified", "Payment verified"],
  ["password.reset", "Password reset"],
  ["doctor.signup", "Doctor signup"],
  ["doctor.deleted", "Doctor deleted"],
  ["retention.unpaid_deleted", "Retention: unpaid deleted"],
  ["retention.originals_purged", "Retention: originals purged"],
];

const fmt = (d) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const targetLink = (t) => {
  if (!t?.id) return null;
  if (t.type === "patient") return <Link href={`/report/${t.id}`} className="link-brand font-mono text-xs">{String(t.id).slice(-6)}</Link>;
  return <span className="font-mono text-xs text-gray-600">{t.type} {String(t.id).slice(-6)}</span>;
};

export default function AuditPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [action, setAction] = useState("");
  const [nextBefore, setNextBefore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (before) => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ limit: "50" });
      if (action) qs.set("action", action);
      if (before) qs.set("before", before);
      const res = await apiFetch(`/admin-audit?${qs}`);
      if (res.status === 401) return router.replace("/login");
      if (res.status === 403) return router.replace("/patients");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load audit log");
      setRows((prev) => (before ? [...prev, ...data.data] : data.data));
      setNextBefore(data.nextBefore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [action, router]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  return (
    <div className="bg-white w-full min-h-screen">
      <Example />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Audit log</h1>
            <p className="text-sm text-gray-500 mt-1">Every sign-in, patient access and change, newest first.</p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="action" className="field-label">Event</label>
            <select id="action" value={action} onChange={(e) => setAction(e.target.value)} className="field-input">
              {ACTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="alert-error mt-6" role="alert"><span>{error}</span></div>}

        <div className="surface mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Record</th>
                <th className="px-4 py-3 font-medium">Outcome</th>
                <th className="px-4 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r._id} className={r.outcome === "failure" ? "bg-red-50/40" : ""}>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-800">{r.action}</td>
                  <td className="px-4 py-2.5 text-gray-700">
                    {r.actorEmail || "—"}
                    {r.actorRole && r.actorRole !== "doctor" && <span className="ml-2 text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{r.actorRole}</span>}
                  </td>
                  <td className="px-4 py-2.5">{targetLink(r.target) || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs rounded-full px-2 py-0.5 ${r.outcome === "failure" ? "bg-red-100 text-red-700" : "bg-[#E4F4E8] text-[#285430]"}`}>{r.outcome}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{r.ip || "—"}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No events yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          {loading ? <Spinner color="#285430" /> : nextBefore && (
            <button type="button" onClick={() => load(nextBefore)} className="btn-secondary">Load more</button>
          )}
        </div>
      </main>
    </div>
  );
}
