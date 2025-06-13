"use client"
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from '../../context/context';
import Example from "@/components/navbar";

export default function Step2() {
  const router = useRouter();

  const {
    firstName,
    nakedEyePhoto,
    setNakedEyePhoto,
    dermoscopePhoto,
    setDermoscopePhoto,
    setNakedEyePreview,
    setDermoscopePreview,
  } = useForm();

  useEffect(() => {
    console.log("The firstname is", firstName);
  }, [firstName]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'naked') {
        setNakedEyePhoto(file);
        setNakedEyePreview(URL.createObjectURL(file));
      } else if (type === 'dermoscope') {
        setDermoscopePhoto(file);
        setDermoscopePreview(URL.createObjectURL(file));
      }
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!nakedEyePhoto || !dermoscopePhoto) {
      alert("Please upload both photos.");
      return;
    }
    router.push("/step3");
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      {/* GREEN NAV */}
      <div className="w-full">
        <Example />
      </div>

      {/* WHITE NAVIGATION BAR */}
      <div className="flex flex-row justify-start items-center w-full space-x-0 sm:space-x-10 py-6 pl-10 shadow-md">
        <Link href="/"><span className="ml-2 text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-105 transition-transform duration-200 ease-in-out sm:ml-40">Patients</span></Link>
        <span className="text-gray-400 text-lg sm:text-xl px-2">•</span>
        <Link href="/"><span className="text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-125 duration-100 transition-transform ease-in-out">Add New Patient</span></Link>
      </div>

      {/* Step indicators */}
      <div className="flex flex-row items-center mt-14 space-x-4">
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">1 <span className="text-base">Basic Information</span></div>
        <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">2 <span className="text-base">Upload Photos</span> </div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">3 <span className="text-base">Choose Region </span></div>
        <div className="text-gray-400 hidden sm:block font-semibold text-2xl pr-20">4 <span className="text-base">Payment</span> </div>
      </div>

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-xl mx-auto mt-6 text-black p-4 gap-2">
        <span className="text-left sm:text-2xl text-3xl font-medium font-poppins text-black my-4">
          Upload Photos for {firstName}
        </span>

        {/* Naked Eye Photo */}
        <div className="flex flex-row justify-start items-center py-2 w-96">
          <Image
            alt="preview"
            height={60}
            width={60}
            className="rounded-full sm:rounded"
            src={"/home_doctor.png"}
          />
          <div className="flex flex-col justify-start items-center py-2 ml-0 sm:ml-4">
            <span className="text-black self-start font-normal italic banner-text">Please upload Naked eye photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'naked')}
              className="text-green-800 bg-gray-200 rounded p-2 sm:w-96 md:w-66 w-56"
              required
            />
          </div>
        </div>

        {/* Dermoscope Photo */}
        <div className="flex flex-row justify-start items-center py-2 w-96">
          <Image
            alt="preview"
            height={60}
            width={60}
            className="rounded-full sm:rounded"
            src={"/home_doctor.png"}
          />
          <div className="flex flex-col justify-start items-center py-2 ml-0 sm:ml-4">
            <span className="text-black self-start font-normal italic banner-text">Please upload Dermoscope photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'dermoscope')}
              className="text-green-800 bg-gray-200 rounded p-2 sm:w-96 md:w-66 w-56"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-row justify-between items-center">
          <span></span>
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
