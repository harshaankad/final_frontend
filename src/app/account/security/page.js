"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";
import Example from "@/components/navbar";
import Spinner from "@/components/Spinner";
import { apiFetch, isLoggedIn, setSession, logout } from "@/lib/auth";

// Account security settings: two-step verification on/off/re-enrol.
export default function SecurityPage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDisable, setShowDisable] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    apiFetch("/me")
      .then(async (res) => {
        if (res.status === 401) return router.replace("/login");
        const data = await res.json();
        setMe(data.user);
      })
      .catch(() => setError("Could not load your account."))
      .finally(() => setLoading(false));
  }, [router]);

  const disable = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await apiFetch("/auth/mfa/disable", { method: "POST", body: { password, code: code.trim() } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not turn off two-step verification.");
        return;
      }
      setSession(data.doctor);
      setMe((m) => ({ ...m, mfaEnabled: false }));
      setShowDisable(false);
      setPassword("");
      setCode("");
      setNotice("Two-step verification is now off. Other devices have been signed out.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOutEverywhere = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <Example />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Account security</h1>
        {me && <p className="text-sm text-gray-500 mt-1">{me.email}</p>}

        {loading ? (
          <div className="flex justify-center py-16"><Spinner color="#285430" /></div>
        ) : (
          <>
            {notice && <div className="mt-6 rounded-lg bg-[#E4F4E8] text-[#285430] px-4 py-3 text-sm">{notice}</div>}
            {error && !showDisable && <div className="alert-error mt-6" role="alert"><span>{error}</span></div>}

            {/* Two-step verification */}
            <section className="surface p-5 sm:p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 rounded-full p-3 ${me?.mfaEnabled ? "bg-[#285430]/10" : "bg-amber-100"}`}>
                  {me?.mfaEnabled
                    ? <ShieldCheckIcon className="h-7 w-7 text-[#285430]" aria-hidden="true" />
                    : <ShieldExclamationIcon className="h-7 w-7 text-amber-600" aria-hidden="true" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">Two-step verification</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {me?.mfaEnabled
                      ? "On. Signing in requires your password and a code from your authenticator app."
                      : "Off. Anyone who learns your password can open your patients' records. Turning this on takes about a minute."}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    {me?.mfaEnabled ? (
                      <>
                        <button type="button" onClick={() => router.push("/mfa/setup")} className="btn-secondary">
                          Move to a new phone
                        </button>
                        <button type="button" onClick={() => { setShowDisable(!showDisable); setError(""); }} className="btn-muted">
                          Turn off
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => router.push("/mfa/setup")} className="btn-primary">
                        Turn on two-step verification
                      </button>
                    )}
                  </div>

                  {showDisable && (
                    <form onSubmit={disable} className="mt-5 border-t border-gray-200 pt-5 flex flex-col gap-4">
                      <p className="text-sm text-gray-700">
                        To confirm it&rsquo;s you, enter your password and a current code from your app (or a backup code).
                      </p>
                      {error && <div className="alert-error" role="alert"><span>{error}</span></div>}
                      <div className="flex flex-col">
                        <label htmlFor="pw" className="field-label">Password</label>
                        <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" autoComplete="current-password" required disabled={busy} />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="code" className="field-label">Authenticator or backup code</label>
                        <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} className="field-input font-mono" inputMode="numeric" autoComplete="one-time-code" required disabled={busy} />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={busy} className="btn-primary">Turn off two-step verification</button>
                        <button type="button" onClick={() => setShowDisable(false)} className="btn-secondary" disabled={busy}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* Sessions */}
            <section className="surface p-5 sm:p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
              <p className="text-sm text-gray-600 mt-1">
                Signing out here ends your session on every device, including this one.
              </p>
              <button type="button" onClick={signOutEverywhere} className="btn-secondary mt-4">Sign out everywhere</button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
