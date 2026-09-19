"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import CodeInput from "@/components/CodeInput";
import { API_BASE } from "@/lib/config";
import { getMfaToken, getToken, setSession, clearSession } from "@/lib/auth";

// Authenticator enrolment. Reached either right after login (account has no
// MFA yet — mfaToken) or from a logged-in session to move to a new phone.
export default function MfaSetup() {
  const router = useRouter();
  const [setup, setSetup] = useState(null); // { qrDataUrl, manualKey, account }
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const bearer = () => getMfaToken() || getToken();
  // Each call to /mfa/setup mints a new secret; guard against React Strict
  // Mode's double effect in dev so the QR shown matches the pending secret.
  const started = useRef(false);

  useEffect(() => {
    const token = bearer();
    if (!token) {
      router.replace("/login");
      return;
    }
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/mfa/setup`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.status === 401) {
          clearSession();
          router.replace("/login");
          return;
        }
        if (!res.ok) throw new Error(data.error || "Could not start setup.");
        setSetup(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const confirm = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter the 6-digit code shown in your app.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/mfa/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer()}` },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "That code didn't match.");
        setCode("");
        return;
      }
      // Session is live from here; show backup codes once before moving on.
      setSession(data.token, data.doctor);
      setBackupCodes(data.backupCodes);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative w-full min-h-screen">
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center px-4 py-10 sm:py-16 transition-all duration-300 ${loading ? "blur-sm" : ""}`}>
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derma</span>Drishti
        </h1>

        {backupCodes ? (
          <>
            <span className="text-center text-3xl sm:text-4xl font-medium text-black mt-4 mb-3 sm:mt-6 sm:mb-4">
              Save your backup codes
            </span>
            <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-md px-2">
              If you lose your phone, any one of these codes will let you sign in. Each works once.
              <strong className="text-gray-900"> They will not be shown again.</strong>
            </span>

            <div className="grid grid-cols-2 gap-2 w-full max-w-sm mt-8 font-mono text-base sm:text-lg text-gray-900">
              {backupCodes.map((c) => (
                <div key={c} className="border border-gray-200 rounded-lg px-3 py-2 text-center bg-gray-50 tracking-wider">{c}</div>
              ))}
            </div>

            <div className="flex flex-col w-full max-w-sm gap-3 mt-6">
              <button type="button" onClick={copyCodes} className="btn-secondary w-full">
                {copied ? "Copied" : "Copy codes"}
              </button>
              <button type="button" onClick={() => router.push("/patients")} className="btn-primary w-full">
                I've saved them — continue
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-center text-3xl sm:text-4xl font-medium text-black mt-4 mb-3 sm:mt-6 sm:mb-4">
              Set up your authenticator
            </span>
            <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-md px-2">
              Patient data on DermaDrishti is protected with two-step verification. Scan this code with
              Google Authenticator, Microsoft Authenticator, Authy or any TOTP app, then enter the 6-digit code it shows.
            </span>

            {error && !setup && (
              <div className="alert-error w-full max-w-sm mt-6" role="alert"><span>{error}</span></div>
            )}

            {setup && (
              <form onSubmit={confirm} className="flex flex-col items-center w-full max-w-sm mx-auto mt-8 text-black gap-5">
                <img
                  src={setup.qrDataUrl}
                  alt="QR code for your authenticator app"
                  width={200}
                  height={200}
                  className="rounded-lg border border-gray-200 p-2 bg-white"
                />

                <button type="button" onClick={() => setShowKey(!showKey)} className="link-brand text-sm">
                  {showKey ? "Hide manual key" : "Can't scan? Enter the key manually"}
                </button>
                {showKey && (
                  <div className="w-full text-center">
                    <div className="font-mono text-sm sm:text-base tracking-wider break-all bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 select-all">
                      {setup.manualKey}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Account: {setup.account} · Type: time-based</p>
                  </div>
                )}

                {error && (
                  <div className="alert-error w-full" role="alert"><span>{error}</span></div>
                )}

                <label className="field-label self-start">Enter the 6-digit code from the app</label>
                <CodeInput length={6} value={code} onChange={setCode} disabled={loading} autoFocus={false} />

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  Turn on two-step verification
                </button>

                <button
                  type="button"
                  onClick={() => { clearSession(); router.push("/login"); }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel and log out
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
}
