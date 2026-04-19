'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner'; // <-- make sure path is correct

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    qualificationPic: '',
    howDoYouKnowAdmin: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      await axios.post('https://dermatology-backend-8xqf.onrender.com/api/auth/send-otp', {
        email: formData.email,
      });

      sessionStorage.setItem('signupData', JSON.stringify(formData));
      router.push(`/verification-code`);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Main Content */}
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center py-8 px-4 sm:py-16 transition-all duration-300 ${loading ? 'blur-sm' : ''}`}>
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derma</span>Drishti
        </h1>

        <span className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium font-poppins text-black my-4 sm:my-8">
          Create your account
        </span>

        <span className="font-normal text-center text-base sm:text-lg text-black max-w-md sm:max-w-lg px-4">
          Let's get started! Sign up now to get your reports generated.
        </span>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto mt-4 sm:mt-6 text-black p-2 sm:p-4 gap-2"
        >
          {/* First Name and Last Name */}
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-4">
            <div className="flex flex-col flex-1">
              <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">First Name</span>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First-Name"
                required
                disabled={loading}
                className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">Last Name</span>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last-Name"
                required
                disabled={loading}
                className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col flex-1 mt-2">
            <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@gmail.com"
              required
              disabled={loading}
              className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Phone and Age */}
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <div className="flex flex-col flex-1">
              <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">Phone Number</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                disabled={loading}
                className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">Age</span>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
                disabled={loading}
                className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col flex-1 mt-2">
            <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              disabled={loading}
              className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* How Do You Know Admin? - Dropdown */}
          <div className="flex flex-col flex-1 mt-2">
            <span className="text-sm sm:text-md font-poppins font-semibold text-black mb-1">How did you hear about us?</span>
            <select
              name="howDoYouKnowAdmin"
              value={formData.howDoYouKnowAdmin}
              onChange={handleChange}
              required
              disabled={loading}
              className="border border-gray-400 rounded h-8 sm:h-10 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select an option</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="No Direct Connection">No Direct Connection</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group mt-4 sm:mt-6 text-[#ffffff] ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="relative z-10">Create account</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </form>

        <span className="text-black text-center text-xs sm:text-sm font-normal font-poppins mt-4 sm:mt-6 px-4">
          Already have an account?{' '}
          <Link href="/login">
            <span className="text-blue-600 text-xs sm:text-sm font-normal cursor-pointer hover:underline transition-all duration-200">
              Login here
            </span>
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
