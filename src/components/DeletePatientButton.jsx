"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { apiFetch } from "@/lib/auth";

/**
 * Permanently erases a patient: DB records, report and every photograph.
 * Rendered for admins only (the API also enforces this — doctors may only
 * delete their own unpaid submissions).
 */
export default function DeletePatientButton({ patientId, patientName }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const erase = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await apiFetch(`/patient/${patientId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not delete the patient.");
      router.push("/patients");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
        <TrashIcon className="h-4 w-4" aria-hidden="true" /> Delete patient record
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5 text-sm">
      <p className="font-semibold text-red-800">This permanently deletes {patientName}&rsquo;s record.</p>
      <p className="text-red-700 mt-1">
        All photographs, the report and the patient entry are erased and cannot be recovered. The deletion is recorded in the audit log.
      </p>
      <label className="block mt-3 text-red-800">
        Type <span className="font-mono font-semibold">DELETE</span> to confirm
        <input value={typed} onChange={(e) => setTyped(e.target.value)} className="field-input mt-1 font-mono" disabled={busy} />
      </label>
      {error && <p className="text-red-700 mt-2">{error}</p>}
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={erase} disabled={busy || typed !== "DELETE"} className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50">
          {busy ? "Deleting…" : "Delete permanently"}
        </button>
        <button type="button" onClick={() => { setConfirming(false); setTyped(""); }} className="btn-secondary" disabled={busy}>Cancel</button>
      </div>
    </div>
  );
}
