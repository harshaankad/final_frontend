"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from '../../context/context';
import Spinner from "@/components/Spinner"; // 👈 Import Spinner

export default function Login() {
  const router = useRouter();
  const { setDoctorId } = useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
      const response = await fetch("https://dermatology-backend-8xqf.onrender.com/api/auth/login", {
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

      const tokenKey = "authToken";

      if (rememberMe) {
        localStorage.setItem(tokenKey, data.token);
      } else {
        sessionStorage.setItem(tokenKey, data.token);
        localStorage.setItem(tokenKey, data.token);
      }

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
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center px-4 transition-all duration-300 ${loading ? 'blur-sm' : ''}`}>
        {/* HEADING */}
        <h1 className="sm:text-3xl text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Ankad</span> CutiScience
        </h1>

        {/* WELCOME BACK TEXT */}
        <span className="text-center sm:text-5xl text-3xl font-medium font-poppins text-black my-8">
          Welcome back!
        </span>

        <span className="font-normal text-[#404040] text-center text-lg text-black max-w-xl">
          Please enter your email address and password to access your account
        </span>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="text-red-600 font-semibold my-2 text-center max-w-xl">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={submitForm}
          className="flex flex-col w-full max-w-xl mx-auto mt-6 text-black p-4 gap-4"
        >
          <div className="flex flex-col flex-1 mt-2">
            <label htmlFor="email" className="text-md font-poppins font-semibold text-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded h-12 px-4 font-poppins shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col flex-1 mt-2">
            <label htmlFor="password" className="text-md font-poppins font-semibold text-black mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 rounded h-12 px-4 font-poppins shadow-md focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={loading}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group mt-6 text-[#ffffff] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>

        <span className="text-black text-center text-sm font-normal font-poppins mt-6">
          Don't have an account yet?{" "}
          <Link href="/signup">
            <span className="text-blue-600 text-sm font-normal cursor-pointer hover:underline transition-all duration-200">Sign up here</span>
          </Link>
        </span>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
}