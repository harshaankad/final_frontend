'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner'; // <-- make sure path is correct
import { API_BASE } from "@/lib/config";

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
      await axios.post(`${API_BASE}/auth/send-otp`, {
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
      <div className={`bg-white w-full min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:py-16 transition-all duration-300 ${loading ? 'blur-sm' : ''}`}>
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black">
          <span className="text-brandGreen">Derma</span>Drishti
        </h1>

        <span className="text-center text-3xl sm:text-4xl md:text-5xl font-medium text-black mt-4 mb-3 sm:mt-6 sm:mb-4">
          Create your account
        </span>

        <span className="font-normal text-gray-600 text-center text-sm sm:text-base max-w-xs sm:max-w-md px-2">
          Let&apos;s get started! Sign up now to get your reports generated.
        </span>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-sm md:max-w-lg mx-auto mt-8 text-black gap-5"
        >
          {/* First Name and Last Name */}
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col flex-1">
              <label htmlFor="firstname" className="field-label">First Name</label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First name"
                required
                disabled={loading}
                className="field-input"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="lastname" className="field-label">Last Name</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last name"
                required
                disabled={loading}
                className="field-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col flex-1">
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@gmail.com"
                required
                disabled={loading}
                className="field-input"
              />
            </div>
          </div>

          {/* Phone and Age */}
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col flex-1">
              <label htmlFor="phone" className="field-label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                disabled={loading}
                className="field-input"
                inputMode="tel"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="age" className="field-label">Age</label>
              <input
                id="age"
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
                disabled={loading}
                className="field-input"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Password */}
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col flex-1">
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={loading}
                className="field-input"
              />
            </div>
          </div>

          {/* How Do You Know Admin? - Dropdown */}
          <div className="flex flex-col flex-1">
            <label htmlFor="howDoYouKnowAdmin" className="field-label">How did you hear about us?</label>
            <select
              id="howDoYouKnowAdmin"
              name="howDoYouKnowAdmin"
              value={formData.howDoYouKnowAdmin}
              onChange={handleChange}
              required
              disabled={loading}
              className="field-input"
            >
              <option value="">Select an option</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="No Direct Connection">No Direct Connection</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            Create account
          </button>
        </form>

        <span className="text-gray-700 text-center text-sm mt-6 px-4">
          Already have an account?{' '}
          <Link href="/login" className="link-brand">
            Login here
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
