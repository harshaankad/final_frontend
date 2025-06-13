'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function VerificationCode() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for OTP digits
  const [otp, setOtp] = useState(['', '', '', '']);

  // Store all signup form data here (read from URL)
  const [signupData, setSignupData] = useState({});

  useEffect(() => {
    // Read all signup data from URL params
    const data = {};
    for (const key of searchParams.keys()) {
      data[key] = searchParams.get(key);
    }

    if (!data.email) {
      alert('Email not found in URL.');
      router.push('/signup');
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

    // Auto-focus next input if available
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length !== 4) {
      alert('Please enter a 4-digit OTP.');
      return;
    }

    try {
      // Send OTP + signup data together
      const payload = {
        ...signupData,
        otp: fullOtp,
      };

      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', payload);

      alert('OTP verified successfully! Your account is created.');

      // After success, redirect user to login or dashboard
      router.push('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'OTP verification failed.');
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-center items-center py-16">
      <span className="text-center sm:text-5xl text-3xl font-semibold text-black my-8">
        Verification Code
      </span>

      <span className="font-normal text-center text-lg text-black">
        We have sent a verification code to your email: <strong>{signupData.email}</strong>
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
          className="bg-[#5F8D4E] w-60 text-[#ffffff] font-bold text-center text-base mt-8 rounded-xl py-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}
