"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/auth";

const MIN_LENGTH = 10;

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/auth/resetpassword", { method: "POST", body: { token, password, confirmPassword } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not reset the password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
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
          Choose a new password
        </span>

        {done ? (
          <div className="flex flex-col items-center gap-6 max-w-md text-center mt-2">
            <span className="text-gray-600 text-sm sm:text-base">Password updated. Taking you to login…</span>
            <Link href="/login" className="btn-primary">Go to login</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col w-full max-w-sm md:max-w-md mx-auto mt-8 text-black gap-5">
            {error && (
              <div className="alert-error" role="alert"><span>{error}</span></div>
            )}
            <div className="flex flex-col">
              <label htmlFor="password" className="field-label">New password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                minLength={MIN_LENGTH}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <span className="text-xs text-gray-500 mt-1">At least {MIN_LENGTH} characters.</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirm" className="field-label">Confirm new password</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="field-input"
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              Update password
            </button>
          </form>
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
