'use client'

import * as THREE from 'three';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Region from '@/components/region';
import Example from "@/components/navbar";
import { useForm } from '../../context/context';

export default function Step3() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    firstName,
    lastName,
    age,
    gender,
    duration,
    previousTreatment,
    nakedEyePhoto,
    dermoscopePhotos,
    siteOfInfection,
    setPatientId,
    setSiteOfInfection, 
  } = useForm();

  // Function to get token from localStorage safely
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  };

  // Validation function
  const validateForm = () => {
    if (!firstName || !lastName || !age || !gender || !duration || !previousTreatment) {
      alert("Please complete all steps starting from Step 1.");
      return false;
    }
    
    if (!nakedEyePhoto || !dermoscopePhotos || dermoscopePhotos.length === 0) {
      alert("Please upload required photos in Step 2.");
      return false;
    }
    
    if (!siteOfInfection) {
      alert("Please select the site of infection.");
      return false;
    }
    
    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("duration", duration);
    formData.append("previousTreatment", previousTreatment);
    formData.append("siteOfInfection", siteOfInfection);
    formData.append("nakedEyePhoto", nakedEyePhoto);
    
    dermoscopePhotos.forEach((photo) => {
      formData.append("dermoscopePhotos", photo);
    });

    try {
      const response = await fetch(`https://dermatology-backend-8xqf.onrender.com/api/create-patient`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        setPatientId(data.data._id);
        console.log("Patient id: ", data.data._id);
        router.push("/patients");
      } else {
        alert(data.message || "Failed to create patient. Please try again.");
      }
    } catch (err) {
      console.error("Error creating patient:", err);
      alert("Something went wrong while creating patient.");
    } finally {
      setLoading(false);
    }
  };

  // Check if form can be submitted
  const canSubmit = () => {
    return firstName && lastName && age && gender && duration && 
           previousTreatment && nakedEyePhoto && dermoscopePhotos && 
           dermoscopePhotos.length > 0 && siteOfInfection;
  };

  // Handle site selection from Region component
  const handleSiteSelection = (site) => {
    setSiteOfInfection(site);
    alert(`You have selected ${site} as the site of infection`);
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">

      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      {/* PROGRESS STEPS */}
      <div className="flex flex-row items-center justify-center mt-8 sm:mt-14 space-x-4">
        <div className="hidden lg:flex flex-row items-center space-x-4">
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            1 <span className="text-base">Basic Information</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            2 <span className="text-base">Upload Photos</span>
          </div>
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">
            3 <span className="text-base">Choose Region</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            4 <span className="text-base">Payment</span>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl">
            3 <span className="text-base">Choose Region</span>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-xl mx-auto mt-6 text-black p-4 gap-2">

        <span className="text-left sm:text-4xl text-3xl font-medium font-poppins text-black my-8">
          Select Region for {firstName}
        </span>

        {/* Summary of uploaded data */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Summary:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Patient:</span> {firstName} {lastName}</p>
            <p><span className="font-medium">Photos:</span> 1 naked eye, {dermoscopePhotos?.length || 0} dermoscope</p>
            <p><span className="font-medium">Site selected:</span> {siteOfInfection || "Not selected"}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-[80vh]">
          <div className="w-full h-[75vh]">
            {/* Pass handleSiteSelection to Region */}
            <Region onSelectSite={handleSiteSelection} />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 w-full max-w-md">
            <Link href="/step2" className="w-full sm:w-auto order-2 sm:order-1">
              <button 
                type="button" 
                className="w-full sm:w-auto font-bold text-base sm:text-lg h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins border-2 border-[#5F8D4E] text-[#5F8D4E] hover:bg-[#5F8D4E] hover:text-white transition-all duration-300 min-w-[120px]"
              >
                Back
              </button>
            </Link>

            <div className="w-full sm:w-auto order-1 sm:order-2">
              {canSubmit() ? (
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group text-[#ffffff] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {loading ? "Creating Patient..." : "Create Patient"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={true}
                  className="w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins min-w-[120px] bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                >
                  Complete All Steps
                </button>
              )}
            </div>
          </div>
        </div>

        {!canSubmit() && (
          <div className="text-red-500 text-sm font-poppins mt-2 text-center">
            * Please complete all previous steps and select the site of infection to continue.
          </div>
        )}
      </form>
    </div>
  );
}
