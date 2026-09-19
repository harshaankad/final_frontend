"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import CodeInput from "@/components/CodeInput";
import { API_BASE } from "@/lib/config";
import { getSignupDraft, clearSignupDraft } from "@/lib/signupDraft";

const OTP_LENGTH = 6;

function VerificationCodeContent() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [signupData, setSignupData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  // Signup data is held in memory only (it includes the password). A refresh
  // loses it, so send the user back to the form.
  useEffect(() => {
    const data = getSignupDraft();
    if (!data?.email) {
      router.replace("/signup");
      return;
    }
    setSignupData(data);
  }, [router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !signupData.email) return;

    try {
      setLoading(true);
      setError("");
      await axios.post(`${API_BASE}/auth/send-otp`, {
        email: signupData.email,
      });
      setResendCooldown(30);
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/auth/verify-otp`, { ...signupData, otp });
      clearSignupDraft();
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`bg-white w-full min-h-screen flex flex-col justify-center items-center py-10 sm:py-16 px-4 transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derma</span>Drishti
        </h1>

        <span className="text-center text-3xl sm:text-4xl md:text-5xl font-medium text-black mt-4 mb-3 sm:mt-6 sm:mb-4">
          Verify your email
        </span>

        <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-xs sm:max-w-md px-2">
          We have sent a verification code to{" "}
          <strong className="text-gray-900 font-semibold">{signupData.email}</strong>
        </span>

        <form
          onSubmit={handleVerify}
          className="flex flex-col justify-center items-center w-full max-w-sm mt-8 text-black gap-6"
        >
          {error && (
            <div className="alert-error w-full" role="alert">
              <span>{error}</span>
            </div>
          )}

          <CodeInput length={OTP_LENGTH} value={otp} onChange={setOtp} disabled={loading} />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            Verify OTP
          </button>

          <div className="text-center">
            {resendCooldown > 0 ? (
              <span className="text-sm text-gray-500">
                Resend OTP in <strong className="text-gray-700">{resendCooldown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="link-brand text-sm disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default function VerificationCodePage() {
  return <VerificationCodeContent />;
}
