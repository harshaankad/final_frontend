"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";

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
      await axios.post("http://localhost:5000/api/auth/send-otp", {
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
        "http://localhost:5000/api/auth/verify-otp",
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
        className={`bg-white w-full min-h-screen flex flex-col justify-center items-center py-8 sm:py-16 px-4 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <span className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-black mb-4 sm:mb-8">
          Verify Your Email
        </span>

        <span className="font-normal text-center text-sm sm:text-lg text-black max-w-xs sm:max-w-lg px-2">
          We have sent a verification code to your email:{" "}
          <strong>{signupData.email}</strong>
        </span>

        <form
          onSubmit={handleVerify}
          className="flex flex-col justify-center items-center w-full max-w-xs sm:max-w-sm md:max-w-md mt-6 text-black p-4"
        >
          <div className="flex flex-row space-x-4 sm:space-x-8 md:space-x-12">
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
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-400 rounded-xl focus:outline-none focus:border-[#5F8D4E] font-poppins transition-colors duration-200"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group mt-6 text-[#ffffff] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="relative z-10">
              {loading ? <Spinner /> : "Verify OTP"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <div className="mt-4 text-center">
            {resendCooldown > 0 ? (
              <span className="text-sm text-gray-500 font-poppins">
                Resend OTP in <strong>{resendCooldown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-sm text-[#5F8D4E] font-semibold font-poppins hover:underline transition-all duration-200 disabled:opacity-50"
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
