'use client'

import * as THREE from 'three';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Region from '@/components/region';
import Example from "@/components/navbar";
import { useForm } from '../../context/context';

export default function Step3() {
  const router = useRouter();

  const {
    firstName,
    lastName,
    age,
    gender,
    duration,
    previousTreatment,
    nakedEyePhoto,
    dermoscopePhoto,
    siteOfInfection,
    setPatientId // uncomment if you want to store patientId
  } = useForm();

  // Function to get token from localStorage safely
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const token = getAuthToken();

    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("duration", duration);
    formData.append("previousTreatment", previousTreatment);
    formData.append("siteOfInfection", siteOfInfection);
    formData.append("nakedEyePhoto", nakedEyePhoto);
    formData.append("dermoscopePhoto", dermoscopePhoto);

    try {
      const response = await fetch(`http://localhost:5000/api/create-patient`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add JWT token here
          // Do NOT set Content-Type manually for FormData
        },
        body: formData,
        credentials: "include",
      });

      // If unauthorized, handle logout
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        // setPatientId && setPatientId(data.patientId); // optional
        setPatientId(data.data._id); // Store the patient ID
        console.log("Patient id: ", data.data._id);
        router.push("/step4");
      } else {
        alert("Failed to create patient. Please try again.");
      }
    } catch (err) {
      console.error("Error creating patient:", err);
      alert("Something went wrong while creating patient.");
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">

      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      {/* WHITE NAVIGATION BAR */}
      <div className="flex flex-row justify-start items-center w-full space-x-0 sm:space-x-10 py-6 pl-10 shadow-md">
        <Link href="/">
          <span className="ml-2 text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-105 transition-transform duration-200 ease-in-out sm:ml-40">Patients</span>
        </Link>
        <span className="text-gray-400 text-lg sm:text-xl px-2">•</span>
        <Link href="/">
          <span className="text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-125 duration-100 transition-transform ease-in-out">Add New Patient</span>
        </Link>
      </div>

      <div className="flex flex-row items-center mt-14 space-x-4">
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">1 <span className="text-base">Basic Information</span></div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">2 <span className="text-base">Upload Photos</span></div>
        <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">3 <span className="text-base">Choose Region</span></div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">4 <span className="text-base">Payment</span></div>
      </div>

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-xl mx-auto mt-6 text-black p-4 gap-2">

        <span className="text-left sm:text-4xl text-3xl font-medium font-poppins text-black my-8">Select Region</span>

        <div className="flex flex-col justify-center items-center h-[80vh]">
          <div className="w-full h-[75vh]">
            <Region />
          </div>

          <button
            type="submit"
            className="bg-[#5F8D4E] text-[#ffffff] font-bold rounded text-center text-base py-2 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out mt-4 uppercase w-36"
          >
            next step
          </button>
        </div>
      </form>
    </div>
  );
}
