"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from '../../context/context';
import Example from "@/components/navbar";
import Stepper from "@/components/Stepper";

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

  // The server re-checks the real file type; this just gives a quick,
  // friendly message for obvious mismatches.
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return false;
    }
    if (file.type && !ACCEPTED_TYPES.includes(file.type)) {
      setError(`"${file.name}" is not a supported image. Please use a JPEG, PNG or WebP photo.`);
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

      <Stepper current={2} />

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-4xl mx-auto mt-4 sm:mt-6 text-black px-4 sm:px-6 pb-10 gap-5 sm:gap-6">
        <h1 className="text-left text-xl sm:text-2xl lg:text-3xl font-medium text-black my-4 sm:my-8">
          Upload Photos{firstName ? ` for ${firstName}` : ""}
        </h1>

        {/* Error message */}
        {error && (
          <div className="alert-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-700" aria-label="Dismiss">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex flex-col divide-y divide-gray-200">
          {/* Naked Eye Photo */}
          <div className="flex flex-col sm:flex-row items-start py-6 sm:py-8 w-full gap-4 sm:gap-6">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-[#F4FFF3] flex items-center justify-center">
              <Image alt="" height={36} width={36} className="object-contain" src={"/patient.png"} />
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="text-black font-semibold text-base sm:text-lg mb-1">
                Clinical Photo *
              </label>
              <span className="text-gray-600 text-sm sm:text-base mb-1">
                Please upload a clear clinical photo of the affected area.
              </span>
              <span className="text-gray-500 text-xs sm:text-sm mb-3">
                Max file size: {MAX_FILE_SIZE_MB}MB
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                onChange={(e) => handleFileChange(e, 'naked')}
                className="block w-full max-w-md text-sm text-gray-600 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2.5 transition-colors duration-150 hover:border-[#5F8D4E]/60 focus:outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/20 file:mr-4 file:h-9 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#5F8D4E] file:text-white file:cursor-pointer hover:file:bg-[#4a7a3a] file:transition-colors"
              />
              {nakedEyePreview && (
                <div className="mt-4 relative inline-block">
                  <img src={nakedEyePreview} alt="Clinical photo preview" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(nakedEyePreview);
                      setNakedEyePhoto(null);
                      setNakedEyePreview(null);
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-gray-600 shadow ring-1 ring-gray-200 flex items-center justify-center text-base leading-none transition-colors hover:bg-red-500 hover:text-white hover:ring-red-500"
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dermoscope Photos */}
          <div className="flex flex-col sm:flex-row items-start py-6 sm:py-8 w-full gap-4 sm:gap-6">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-[#F4FFF3] flex items-center justify-center">
              <Image alt="" height={36} width={36} className="object-contain" src={"/patient.png"} />
            </div>
            <div className="flex flex-col justify-start w-full">
              <label className="text-black font-semibold text-base sm:text-lg mb-1">
                Dermoscope Photos *{" "}
                <span className="font-normal text-gray-500 text-sm">({dermoscopePhotos.length} uploaded)</span>
              </label>
              <span className="text-gray-600 text-sm sm:text-base mb-1">
                Please upload one or more dermoscope photos of the affected area. You can select multiple files at once or add them one by one.
              </span>
              <span className="text-gray-500 text-xs sm:text-sm mb-3">
                Max file size: {MAX_FILE_SIZE_MB}MB per image
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                onChange={(e) => handleFileChange(e, 'dermoscope')}
                className="block w-full max-w-md text-sm text-gray-600 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2.5 transition-colors duration-150 hover:border-[#5F8D4E]/60 focus:outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/20 file:mr-4 file:h-9 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#5F8D4E] file:text-white file:cursor-pointer hover:file:bg-[#4a7a3a] file:transition-colors"
              />
              {dermoscopePreviews && dermoscopePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {dermoscopePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        alt={`Dermoscope photo ${idx + 1}`}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeDermoscopePhoto(idx)}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-gray-600 shadow ring-1 ring-gray-200 flex items-center justify-center text-base leading-none transition-colors hover:bg-red-500 hover:text-white hover:ring-red-500"
                        aria-label="Remove photo"
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
          <div className="alert-error" role="alert">
            <span>Please upload both required photos to continue.</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 sm:mt-4">
          <Link href="/step1" className="w-full sm:w-auto order-2 sm:order-1">
            <button type="button" className="btn-secondary w-full sm:w-auto sm:min-w-[140px]">
              Back
            </button>
          </Link>
          <div className="w-full sm:w-auto order-1 sm:order-2">
            {isFormValid() ? (
              <button type="submit" className="btn-primary w-full sm:w-auto sm:min-w-[160px]">
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAttempted(true)}
                className="btn-muted w-full sm:w-auto sm:min-w-[160px]"
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
