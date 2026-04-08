"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from '../../context/context';
import Spinner from "@/components/Spinner";

export default function Login() {
  const router = useRouter();
  const { setDoctorId } = useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("doctorData", JSON.stringify(data.doctor));

      if (data.doctor && data.doctor._id) {
        setDoctorId(data.doctor._id);
        localStorage.setItem("doctorId", data.doctor._id);
      } else if (data.doctor && data.doctor.id) {
        setDoctorId(data.doctor.id);
        localStorage.setItem("doctorId", data.doctor.id);
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
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-16 transition-all duration-300 ${loading ? 'blur-sm' : ''}`}>
        {/* HEADING */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derm</span>Drishti
        </h1>

        {/* WELCOME BACK TEXT */}
        <span className="text-center text-3xl sm:text-4xl md:text-5xl font-medium font-poppins text-black my-4 sm:my-8">
          Welcome back!
        </span>

        <span className="font-normal text-[#404040] text-center text-sm sm:text-lg text-black max-w-xs sm:max-w-xl px-2">
          Please enter your email address and password to access your account
        </span>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="text-red-600 font-semibold my-2 text-center max-w-xs sm:max-w-xl px-2">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={submitForm}
          className="flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto mt-4 sm:mt-6 text-black p-2 sm:p-4 gap-3 sm:gap-4"
        >
          <div className="flex flex-col flex-1 mt-2">
            <label htmlFor="email" className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col flex-1 mt-2">
            <label htmlFor="password" className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={loading}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group mt-4 sm:mt-6 text-[#ffffff] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>

        <span className="text-black text-center text-xs sm:text-sm font-normal font-poppins mt-4 sm:mt-6 px-4">
          Don't have an account yet?{" "}
          <Link href="/signup">
            <span className="text-blue-600 text-xs sm:text-sm font-normal cursor-pointer hover:underline transition-all duration-200">Sign up here</span>
          </Link>
        </span>
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
