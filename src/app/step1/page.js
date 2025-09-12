"use client"
import { useState } from "react";
import Link from "next/link";
import { useForm } from '../../context/context';
import Example from "@/components/navbar";

export default function Step1() {
  const [loading, setLoading] = useState(false);
  
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,
    gender,
    setGender,
    duration,
    setDuration,
    previousTreatment,
    setPreviousTreatment,
    image,
    setImage,
    imagePreview,
    setImagePreview,
  } = useForm();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    switch (name) {
      case "First-Name":
        setFirstName(value);
        break;
      case "Last-Name":
        setLastName(value);
        break;
      case "age":
        setAge(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "duration":
        setDuration(value);
        break;
      case "previousTreatment":
        setPreviousTreatment(value);
        break;
      case "image":
        const file = files[0];
        if (file) {
          setImage(file);
          setImagePreview(URL.createObjectURL(file));
        }
        break;
      default:
        break;
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return firstName.trim() !== '' && 
           lastName.trim() !== '' && 
           age !== '' && 
           gender !== '' && 
           duration.trim() !== '' && 
           previousTreatment.trim() !== '';
  };

  const handleNext = () => {
    if (isFormValid()) {
      setLoading(true);
      // Simulate loading for better UX
      setTimeout(() => {
        setLoading(false);
        // Navigation will happen via Link
      }, 500);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      {/* PROGRESS STEPS */}
      <div className="flex flex-row items-center justify-center mt-8 sm:mt-14 space-x-4">
        {/* Show all 4 steps on larger screens (lg and above) */}
        <div className="hidden lg:flex flex-row items-center space-x-4">
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">
            1 <span className="text-base">Basic Information</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            2 <span className="text-base">Upload Photos</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            3 <span className="text-base">Choose Region</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            4 <span className="text-base">Payment</span>
          </div>
        </div>
        
        {/* Show only current step on smaller screens */}
        <div className="lg:hidden">
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl">
            1 <span className="text-base">Basic Information</span>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form className="flex flex-col w-full max-w-4xl mx-auto mt-4 sm:mt-6 text-black p-4 sm:p-6 gap-4 sm:gap-6">
        <span className="text-left text-xl sm:text-2xl lg:text-3xl font-medium font-poppins text-black my-4 sm:my-8">
          Basic Information
        </span>

        {/* Name Fields */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* First Name */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="firstName"
              className="text-sm sm:text-base font-poppins font-semibold text-black mb-1 sm:mb-2"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="First-Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="lastName"
              className="text-sm sm:text-base font-poppins font-semibold text-black mb-1 sm:mb-2"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="Last-Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Age and Gender Fields */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Age */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="age"
              className="text-sm sm:text-base font-poppins font-semibold text-black mb-1 sm:mb-2"
            >
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter your age"
              value={age}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200"
              required
              min={1}
              max={120}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="gender"
              className="text-sm sm:text-base font-poppins font-semibold text-black mb-1 sm:mb-2"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200 bg-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Duration and Previous Treatment Fields */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Duration */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="duration"
              className="text-sm sm:text-base font-poppins font-semibold text-black mb-1 sm:mb-2"
            >
              Duration *
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="e.g., 2 weeks, 1 month"
              value={duration}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200"
              required
            />
          </div>

          {/* Previous Treatment */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="previousTreatment"
              className="text-sm sm:text-base font-poppins font-semibold text-black mb-1 sm:mb-2"
            >
              Previous Treatment *
            </label>
            <input
              type="text"
              id="previousTreatment"
              name="previousTreatment"
              placeholder="Describe any previous treatments"
              value={previousTreatment}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 font-poppins text-sm sm:text-base focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Validation Message */}
        {!isFormValid() && (
          <div className="text-red-500 text-sm font-poppins mt-2">
            * Please fill in all required fields to continue.
          </div>
        )}

        {/* Next Button */}
        <div className="flex flex-row justify-center sm:justify-end items-center mt-4 sm:mt-6">
          {isFormValid() ? (
            <Link href="/step2" className="w-full sm:w-auto">
              <button
                type="button"
                disabled={loading}
                onClick={handleNext}
                className={`w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group text-[#ffffff] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? "Processing..." : "Next Step"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </Link>
          ) : (
            <button
              type="button"
              disabled={true}
              className="w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins min-w-[120px] bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
            >
              Next Step
            </button>
          )}
        </div>
      </form>
    </div>
  );
}