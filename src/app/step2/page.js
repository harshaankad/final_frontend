"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from '../../context/context';
import Example from "@/components/navbar";

const MAX_FILE_SIZE_MB = 10;

export default function Step2() {
  const router = useRouter();
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState("");

  const {
    firstName,
    nakedEyePhoto, setNakedEyePhoto,
    dermoscopePhotos, setDermoscopePhotos,
    nakedEyePreview, setNakedEyePreview,
    dermoscopePreviews, setDermoscopePreviews,
  } = useForm();

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e, type) => {
    setError("");

    if (type === 'naked') {
      const file = e.target.files[0];
      if (file) {
        if (!validateFileSize(file)) {
          e.target.value = '';
          return;
        }
        setNakedEyePhoto(file);
        setNakedEyePreview(URL.createObjectURL(file));
      }
    } else if (type === 'dermoscope') {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const validFiles = [];
        for (const file of files) {
          if (!validateFileSize(file)) {
            e.target.value = '';
            return;
          }
          validFiles.push(file);
        }

        setDermoscopePhotos(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setDermoscopePreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const removeDermoscopePhoto = (indexToRemove) => {
    URL.revokeObjectURL(dermoscopePreviews[indexToRemove]);
    setDermoscopePhotos(prev => prev.filter((_, i) => i !== indexToRemove));
    setDermoscopePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // Clean up URL objects on unmount
  useEffect(() => {
    return () => {
      if (nakedEyePreview) URL.revokeObjectURL(nakedEyePreview);
      dermoscopePreviews.forEach(p => URL.revokeObjectURL(p));
    };
  }, []);

  const isFormValid = () => {
    return nakedEyePhoto && dermoscopePhotos && dermoscopePhotos.length > 0;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setAttempted(true);
      return;
    }
    router.push("/step3");
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      <div className="w-full">
        <Example />
      </div>

      {/* PROGRESS STEPS */}
      <div className="flex flex-row items-center justify-center mt-8 sm:mt-14 space-x-4">
        <div className="hidden lg:flex flex-row items-center space-x-4">
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            1 <span className="text-base">Basic Information</span>
          </div>
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">
            2 <span className="text-base">Upload Photos</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            3 <span className="text-base">Choose Region</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            4 <span className="text-base">Payment</span>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl">
            2 <span className="text-base">Upload Photos</span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError("")} className="text-red-700 hover:text-red-900 ml-4">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-4xl mx-auto mt-4 sm:mt-6 text-black p-4 sm:p-6 gap-4 sm:gap-6">
        <span className="text-center text-xl sm:text-2xl lg:text-3xl font-medium font-poppins text-black my-4 sm:my-8">
          Upload Photos for {firstName}
        </span>

        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Naked Eye Photo */}
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center py-4 w-full border-b border-gray-200 pb-6">
            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
              <Image alt="Naked eye photo icon" height={60} width={60} className="rounded-full object-cover" src={"/patient.png"} />
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="text-black font-semibold text-base sm:text-lg font-poppins mb-2">
                Clinical Photo *
              </label>
              <span className="text-gray-600 text-sm sm:text-base font-normal italic mb-2">
                Please upload a clear Clinical photo of the affected area
              </span>
              <span className="text-gray-500 text-xs sm:text-sm font-normal mb-3">
                Max file size: {MAX_FILE_SIZE_MB}MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'naked')}
                className="text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-3 w-full max-w-md focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C9C9C9] file:text-gray-800 hover:file:bg-[#B8B8B8] file:cursor-pointer file:transition-colors file:duration-200"
              />
              {nakedEyePreview && (
                <div className="mt-3 relative inline-block">
                  <img src={nakedEyePreview} alt="Naked eye preview" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-gray-200" />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(nakedEyePreview);
                      setNakedEyePhoto(null);
                      setNakedEyePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dermoscope Photos */}
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center py-4 w-full border-b border-gray-200 pb-6">
            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
              <Image alt="Dermoscope photo icon" height={60} width={60} className="rounded-full object-cover" src={"/patient.png"} />
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="text-black font-semibold text-base sm:text-lg font-poppins mb-2">
                Dermoscope Photos * ({dermoscopePhotos.length} uploaded)
              </label>
              <span className="text-gray-600 text-sm sm:text-base font-normal italic mb-2">
                Please upload one or more dermoscope photos of the affected area. You can select multiple files at once or add them one by one.
              </span>
              <span className="text-gray-500 text-xs sm:text-sm font-normal mb-3">
                Max file size: {MAX_FILE_SIZE_MB}MB per image
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'dermoscope')}
                className="text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-3 w-full max-w-md focus:border-[#5F8D4E] focus:outline-none focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C9C9C9] file:text-gray-800 hover:file:bg-[#B8B8B8] file:cursor-pointer file:transition-colors file:duration-200"
              />
              {dermoscopePreviews && dermoscopePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {dermoscopePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        alt={`dermoscope-${idx}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeDermoscopePhoto(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation - only after attempt */}
        {attempted && !isFormValid() && (
          <div className="text-red-500 text-sm font-poppins mt-2">
            * Please upload both required photos to continue.
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <Link href="/step1" className="w-full sm:w-auto order-2 sm:order-1">
            <button type="button" className="w-full sm:w-auto font-bold text-base sm:text-lg h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins border-2 border-[#5F8D4E] text-[#5F8D4E] hover:bg-[#5F8D4E] hover:text-white transition-all duration-300 min-w-[120px]">
              Back
            </button>
          </Link>
          <div className="w-full sm:w-auto order-1 sm:order-2">
            {isFormValid() ? (
              <button
                type="submit"
                className="w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group text-[#ffffff]"
              >
                <span className="relative z-10">Next Step</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAttempted(true)}
                className="w-full sm:w-auto font-bold text-base sm:text-lg md:text-xl h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins min-w-[120px] bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
