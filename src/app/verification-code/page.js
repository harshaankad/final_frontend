"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";

function VerificationCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [signupData, setSignupData] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Extract params safely
  useEffect(() => {
    const data = {};
    for (const key of searchParams.keys()) {
      data[key] = searchParams.get(key);
    }

    if (!data.email) {
      alert("Email not found in URL.");
      router.push("/signup");
      return;
    }

    setSignupData(data);
  }, [searchParams, router]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
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
        "https://dermatology-backend-8xqf.onrender.com/api/auth/verify-otp",
        payload
      );

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
        className={`bg-white w-full min-h-screen flex flex-col justify-center items-center py-16 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <span className="text-center sm:text-5xl text-3xl font-semibold text-black my-8">
          Verification Code
        </span>

        <span className="font-normal text-center text-lg text-black">
          We have sent a verification code to your email:{" "}
          <strong>{signupData.email}</strong>
        </span>

        <form
          onSubmit={handleVerify}
          className="flex flex-col justify-center items-center w-96 mt-6 text-black p-4"
        >
          <div className="flex flex-row space-x-12">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-400 rounded-xl focus:outline-none focus:border-green-800 font-poppins"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group mt-6 text-[#ffffff] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="relative z-10">
              {loading ? <Spinner /> : "Verify OTP"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
}

// ✅ Wrap inside Suspense for Next.js App Router
export default function VerificationCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationCodeContent />
    </Suspense>
  );
}
