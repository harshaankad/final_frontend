"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import CodeInput from "@/components/CodeInput";
import { apiFetch, hasMfaPending, setSession, clearSession } from "@/lib/auth";

// Login step 2: the authenticator code (or a backup code) → session.
export default function MfaVerify() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [backupMode, setBackupMode] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasMfaPending()) router.replace("/login");
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const value = backupMode ? backupCode.trim() : code;
    if (backupMode ? value.length < 10 : value.length !== 6) {
      setError(backupMode ? "Enter your full backup code." : "Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/auth/mfa/verify", { method: "POST", body: { code: value } });
      const data = await res.json();
      if (res.status === 401 && data.error?.includes("token")) {
        // MFA cookie expired (5 minutes) — start over.
        clearSession();
        router.replace("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Could not verify the code.");
        setCode("");
        setBackupCode("");
        return;
      }
      setSession(data.doctor);
      router.push("/patients");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center px-4 py-10 sm:py-16 transition-all duration-300 ${loading ? "blur-sm" : ""}`}>
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derma</span>Drishti
        </h1>

        <span className="text-center text-3xl sm:text-4xl md:text-5xl font-medium text-black mt-4 mb-3 sm:mt-6 sm:mb-4">
          Two-step verification
        </span>

        <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-xs sm:max-w-md px-2">
          {backupMode
            ? "Enter one of the backup codes you saved when you set up your authenticator."
            : "Open your authenticator app and enter the 6-digit code for DermaDrishti."}
        </span>

        <form onSubmit={submit} className="flex flex-col items-center w-full max-w-sm mx-auto mt-8 text-black gap-5">
          {error && (
            <div className="alert-error w-full" role="alert">
              <span>{error}</span>
            </div>
          )}

          {backupMode ? (
            <div className="flex flex-col w-full">
              <label htmlFor="backup" className="field-label">Backup code</label>
              <input
                id="backup"
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                placeholder="ABCDE-23456"
                className="field-input font-mono tracking-widest text-center"
                autoComplete="off"
                autoFocus
                disabled={loading}
              />
            </div>
          ) : (
            <CodeInput length={6} value={code} onChange={setCode} disabled={loading} />
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            Verify
          </button>

          <button
            type="button"
            onClick={() => { setBackupMode(!backupMode); setError(""); setCode(""); setBackupCode(""); }}
            className="link-brand text-sm"
          >
            {backupMode ? "Use authenticator app instead" : "Use a backup code instead"}
          </button>

          <Link href="/login" onClick={clearSession} className="text-sm text-gray-500 hover:text-gray-700">
            Back to login
          </Link>
        </form>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
}
