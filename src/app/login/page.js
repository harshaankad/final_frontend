"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from '../../context/context'; // Import your context

export default function Login() {
  const router = useRouter();
  
  // Get setDoctorId from context
  const { setDoctorId } = useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    setError(""); // Clear previous errors
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

      // Save token based on remember me preference
      const tokenKey = "authToken";
      
      if (rememberMe) {
        localStorage.setItem(tokenKey, data.token);
      } else {
        sessionStorage.setItem(tokenKey, data.token);
        // Also set in localStorage for patients page compatibility
        localStorage.setItem(tokenKey, data.token);
      }

      // Save doctor info in localStorage
      localStorage.setItem("doctorData", JSON.stringify(data.doctor));
      
      // ✅ NEW: Store doctor ID in context for immediate use
      if (data.doctor && data.doctor._id) {
        setDoctorId(data.doctor._id);
        // Also store in localStorage as backup
        localStorage.setItem("doctorId", data.doctor._id);
      } else if (data.doctor && data.doctor.id) {
        setDoctorId(data.doctor.id);
        localStorage.setItem("doctorId", data.doctor.id);
      } else {
        console.warn("Doctor ID not found in login response");
      }

      console.log("Login successful:", data.message);
      console.log("Doctor ID stored:", data.doctor._id || data.doctor.id);
      
      // Redirect to patients page on successful login
      router.push("/patients");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-center items-center px-4">
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
          <label
            htmlFor="email"
            className="text-md font-poppins font-semibold text-black mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded h-12 px-4 font-poppins shadow-md"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col flex-1 mt-2">
          <label
            htmlFor="password"
            className="text-md font-poppins font-semibold text-black mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded h-12 px-4 font-poppins shadow-md"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-row mt-8 w-full justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="cursor-pointer"
              disabled={loading}
            />
            <span className="text-black text-sm font-normal">Remember me</span>
          </label>
          <Link href="/forgot-password">
            <span className="text-blue-600 text-sm font-normal cursor-pointer">
              Forgot your password?
            </span>
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`text-white font-bold text-center text-base rounded py-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out mt-4 ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#5F8D4E] hover:bg-[#4a7a3a]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <span className="text-gray-800 uppercase text-center font-light">or</span>

        <button
          type="button"
          disabled={loading}
          className="flex flex-row justify-center items-center bg-white border border-gray-400 text-black text-center text-base rounded py-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            // Implement Google login flow here
            console.log("Google login clicked");
          }}
        >
          <Image
            alt="google logo"
            className="rounded-full"
            src={
              "https://img.freepik.com/premium-vector/google-icon_1273375-870.jpg?w=826"
            }
            height={30}
            width={30}
          />
          <span className="ml-4 font-medium font-poppins">Signup with Google</span>
        </button>
      </form>

      <span className="text-black text-center text-sm font-normal font-poppins mt-6">
        Don't have an account yet?{" "}
        <Link href="/signup">
          <span className="text-blue-600 text-sm font-normal cursor-pointer">
            Sign up here
          </span>
        </Link>
      </span>
    </div>
  );
}