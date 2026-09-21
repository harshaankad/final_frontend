"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import MfaPromptModal from "@/components/MfaPromptModal";
import { apiFetch, setMfaPending, setSession, clearSession } from "@/lib/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      clearSession();

      if (data.mfaRequired) {
        // Two-step verification is on: the server set a short-lived MFA
        // cookie; the session cookie is issued after the code.
        setMfaPending();
        router.push("/mfa");
        return;
      }

      // Logged in (session cookie set). MFA is off, so nudge before continuing.
      setSession(data.doctor);
      if (data.mfaPrompt) {
        setShowMfaPrompt(true);
        return;
      }
      router.push("/patients");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Main Content */}
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center px-4 py-10 sm:py-16 transition-all duration-300 ${loading ? 'blur-sm' : ''}`}>
        {/* HEADING */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derma</span>Drishti
        </h1>

        {/* WELCOME BACK TEXT */}
        <span className="text-center text-3xl sm:text-4xl md:text-5xl font-medium text-black mt-4 mb-3 sm:mt-6 sm:mb-4">
          Welcome back!
        </span>

        <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-xs sm:max-w-md px-2">
          Please enter your email address and password to access your account
        </span>

        {/* FORM */}
        <form
          onSubmit={submitForm}
          className="flex flex-col w-full max-w-sm md:max-w-md mx-auto mt-8 text-black gap-5"
        >
          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end -mt-2">
            <Link href="/forgot-password" className="link-brand text-sm">
              Forgot password?
            </Link>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            Login
          </button>
        </form>

        <span className="text-gray-700 text-center text-sm mt-6 px-4">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="link-brand">
            Sign up here
          </Link>
        </span>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <Spinner />
        </div>
      )}

      <MfaPromptModal
        open={showMfaPrompt}
        onActivate={() => router.push("/mfa/setup")}
        onSkip={() => router.push("/patients")}
      />
    </div>
  );
}
