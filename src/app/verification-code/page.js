"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { API_BASE } from "@/lib/config";

function VerificationCodeContent() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [signupData, setSignupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef([]);

  // Read signup data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('signupData');
    if (!stored) {
      alert("Signup data not found. Please sign up again.");
      router.push("/signup");
      return;
    }

    const data = JSON.parse(stored);
    if (!data.email) {
      alert("Email not found. Please sign up again.");
      router.push("/signup");
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

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const digits = pasted.replace(/\D/g, "").slice(0, 4);
    if (!digits) return;

    const newOtp = ["", "", "", ""];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);

    // Focus the next empty box or the last one
    const nextEmpty = digits.length < 4 ? digits.length : 3;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !signupData.email) return;

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/auth/send-otp`, {
        email: signupData.email,
      });
      setResendCooldown(30);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      alert("OTP resent successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 4) {
      alert("Please enter a 4-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...signupData,
        otp: fullOtp,
      };

      await axios.post(
        `${API_BASE}/auth/verify-otp`,
        payload
      );

      sessionStorage.removeItem('signupData');
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.error || "OTP verification failed.");
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
          <div className="flex flex-row gap-3 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-semibold text-gray-900 border border-gray-300 rounded-lg bg-white transition-colors duration-150 focus:outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/20"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

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
