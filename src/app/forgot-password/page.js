"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch("/auth/resetpasswordtoken", { method: "POST", body: { email } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send the reset email.");
        return;
      }
      setSent(true);
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
          Forgot password
        </span>

        {sent ? (
          <div className="flex flex-col items-center gap-6 max-w-md text-center mt-2">
            <span className="text-gray-600 text-sm sm:text-base">
              If an account exists for <strong className="text-gray-900">{email}</strong>, a reset link is on its way.
              It is valid for 1 hour.
            </span>
            <Link href="/login" className="btn-primary">Back to login</Link>
          </div>
        ) : (
          <>
            <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-xs sm:max-w-md px-2">
              Enter your account email and we&apos;ll send you a link to choose a new password.
            </span>
            <form onSubmit={submit} className="flex flex-col w-full max-w-sm md:max-w-md mx-auto mt-8 text-black gap-5">
              {error && (
                <div className="alert-error" role="alert"><span>{error}</span></div>
              )}
              <div className="flex flex-col">
                <label htmlFor="email" className="field-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@gmail.com"
                  className="field-input"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                Send reset link
              </button>
              <Link href="/login" className="link-brand text-sm text-center">Back to login</Link>
            </form>
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
