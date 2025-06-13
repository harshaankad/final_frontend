'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const router = useRouter();
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
    try {
      // Send OTP to email
      await axios.post('http://localhost:5000/api/auth/send-otp', {
        email: formData.email,
      });

      alert('OTP sent successfully!');

      // Build query string from formData object
      const queryString = new URLSearchParams(formData).toString();

      // Redirect to verification-code page with query string
      router.push(`/verification-code?${queryString}`);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-center items-center py-16">
      <h1 className="sm:text-3xl text-3xl font-semibold text-center text-black">
        <span className="text-brandGreen">Ankad</span> CutiScience
      </h1>

      <span className="text-center sm:text-5xl text-3xl font-medium font-poppins text-black my-8">
        Create your account
      </span>

      <span className="font-normal text-center text-lg text-black">
        Let's get started! Sign up now to access all of our features and content.
      </span>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-xl mx-auto mt-6 text-black p-4 gap-2"
      >
        {/* All your input fields here */}
        {/* First Name */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex flex-col flex-1">
            <span className="text-md font-poppins font-semibold text-black mb-1">First Name</span>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First-Name"
              required
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
            />
          </div>

          <div className="flex flex-col flex-1">
            <span className="text-md font-poppins font-semibold text-black mb-1">Last Name</span>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last-Name"
              required
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col flex-1 mt-2">
          <span className="text-md font-poppins font-semibold text-black mb-1">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@gmail.com"
            required
            className="border border-gray-400 rounded h-10 px-4 font-poppins"
          />
        </div>

        {/* Phone and Age */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mt-2">
          <div className="flex flex-col flex-1">
            <span className="text-md font-poppins font-semibold text-black mb-1">Phone Number</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
            />
          </div>

          <div className="flex flex-col flex-1">
            <span className="text-md font-poppins font-semibold text-black mb-1">Age</span>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col flex-1 mt-2">
          <span className="text-md font-poppins font-semibold text-black mb-1">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border border-gray-400 rounded h-10 px-4 font-poppins"
          />
        </div>

        {/* Qualification Pic */}
        <div className="flex flex-col flex-1 mt-2">
          <span className="text-md font-poppins font-semibold text-black mb-1">Qualification Pic (URL)</span>
          <input
            type="text"
            name="qualificationPic"
            value={formData.qualificationPic}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="border border-gray-400 rounded h-10 px-4 font-poppins"
          />
        </div>

        {/* How Do You Know Admin? */}
        <div className="flex flex-col flex-1 mt-2">
          <span className="text-md font-poppins font-semibold text-black mb-1">How Do You Know Admin?</span>
          <input
            type="text"
            name="howDoYouKnowAdmin"
            value={formData.howDoYouKnowAdmin}
            onChange={handleChange}
            placeholder="Ex: Instagram, Friend"
            required
            className="border border-gray-400 rounded h-10 px-4 font-poppins"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#5F8D4E] text-[#ffffff] font-bold text-center text-base rounded py-2 px-4 mt-4 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out"
        >
          Create account
        </button>

        <span className="text-gray-800 uppercase text-center font-light mt-4">or</span>

        {/* Google Signup (dummy) */}
        <button
          type="button"
          className="flex flex-row justify-center items-center bg-white border border-gray-400 text-black text-center text-base rounded py-2 mt-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out"
        >
          <Image
            alt="google logo"
            className="rounded-full"
            src="https://img.freepik.com/premium-vector/google-icon_1273375-870.jpg?w=826"
            height={30}
            width={30}
          />
          <span className="ml-4 font-medium font-poppins">Signup with Google</span>
        </button>
      </form>

      <span className="text-black text-center text-sm font-normal font-poppins mt-6">
        Already have an account?{' '}
        <Link href="/login">
          <span className="text-blue-600 text-sm font-normal cursor-pointer">Login here</span>
        </Link>
      </span>
    </div>
  );
}
