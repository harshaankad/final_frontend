"use client"
import { useState } from "react";
import Link from "next/link";
import { useForm } from '../../context/context';
import Example from "@/components/navbar";

export default function Step1() {
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

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      {/* WHITE NAVIGATION BAR */}
      <div className="flex flex-row justify-start items-center w-full space-x-0 sm:space-x-10 py-6 pl-10 shadow-md">
        <Link href="/">
          <span className="ml-2 text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-105 transition-transform duration-200 ease-in-out sm:ml-40">
            Patients
          </span>
        </Link>
        <span className="text-gray-400 text-lg sm:text-xl px-2">•</span>
        <Link href="/">
          <span className="text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-125 duration-100 transition-transform ease-in-out">
            Add New Patient
          </span>
        </Link>
      </div>

      <div className="flex flex-row items-center mt-14 space-x-4">
        <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">
          1 <span className="text-base">Basic Information</span>
        </div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">
          2 <span className="text-base">Upload Photos</span>
        </div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">
          3 <span className="text-base">Choose Region</span>
        </div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">
          4 <span className="text-base">Payment</span>
        </div>
      </div>

      {/* FORM */}
      <form className="flex flex-col w-full max-w-4xl mx-auto mt-6 text-black p-4 gap-4">
        <span className="text-left sm:text-2xl text-3xl font-medium font-poppins text-black my-8">
          Basic Information
        </span>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          {/* First Name */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="firstName"
              className="text-sm font-poppins font-semibold text-black mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="First-Name"
              placeholder="First Name"
              value={firstName}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="lastName"
              className="text-sm font-poppins font-semibold text-black mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="Last-Name"
              placeholder="Last Name"
              value={lastName}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
              required
            />
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          {/* Age */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="age"
              className="text-sm font-poppins font-semibold text-black mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Age"
              value={age}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
              required
              min={0}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="gender"
              className="text-sm font-poppins font-semibold text-black mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          {/* Duration */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="duration"
              className="text-sm font-poppins font-semibold text-black mb-1"
            >
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="Duration"
              value={duration}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
              required
            />
          </div>

          {/* Previous Treatment */}
          <div className="flex flex-col flex-1">
            <label
              htmlFor="previousTreatment"
              className="text-sm font-poppins font-semibold text-black mb-1"
            >
              Previous Treatment
            </label>
            <input
              type="text"
              id="previousTreatment"
              name="previousTreatment"
              placeholder="Previous Treatment"
              value={previousTreatment}
              onChange={handleChange}
              className="border border-gray-400 rounded h-10 px-4 font-poppins"
              required
            />
          </div>
        </div>

        <div className="flex flex-row justify-end items-center mt-6">
          <Link href="/step2">
            <button
              type="button"
              className="bg-[#5F8D4E] text-white font-bold rounded text-base py-2 px-6 hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out uppercase"
            >
              Next Step
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
