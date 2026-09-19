'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Region from '@/components/region';
import Example from "@/components/navbar";
import Stepper from "@/components/Stepper";
import { useForm } from '../../context/context';
import { API_BASE } from "@/lib/config";

export default function Step3() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const {
    firstName,
    lastName,
    age,
    gender,
    duration,
    previousTreatment,
    clinicalImpression,
    nakedEyePhoto,
    dermoscopePhotos,
    siteOfInfection,
    setPatientId,
    setSiteOfInfection,
  } = useForm();

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  };

  const validateForm = () => {
    if (!firstName || !lastName || !age || !gender || !duration || !previousTreatment) {
      alert("Please complete all steps starting from Step 1.");
      return false;
    }

    if (!nakedEyePhoto || !dermoscopePhotos || dermoscopePhotos.length === 0) {
      alert("Please upload required photos in Step 2.");
      return false;
    }

    if (!siteOfInfection || siteOfInfection.length === 0) {
      setAttempted(true);
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
    formData.append("clinicalImpression", clinicalImpression);
    formData.append("siteOfInfection", siteOfInfection.join(", "));
    formData.append("nakedEyePhoto", nakedEyePhoto);

    dermoscopePhotos.forEach((photo) => {
      formData.append("dermoscopePhotos", photo);
    });

    try {
      const response = await fetch(`${API_BASE}/create-patient`, {
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

      if (data.success) {
        setPatientId(data.data._id);
        router.push("/step4");
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

  const canSubmit = () => {
    return firstName && lastName && age && gender && duration &&
           previousTreatment && nakedEyePhoto && dermoscopePhotos &&
           dermoscopePhotos.length > 0 && siteOfInfection.length > 0;
  };

  const handleSiteSelection = (site) => {
    setSiteOfInfection(site);
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">

      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      <Stepper current={3} />

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-2xl mx-auto mt-4 sm:mt-6 text-black px-4 sm:px-6 pb-10 gap-5 sm:gap-6">

        <h1 className="text-left text-xl sm:text-2xl lg:text-3xl font-medium text-black my-4 sm:my-8">
          Select Region{firstName ? ` for ${firstName}` : ""}
        </h1>

        {/* Summary of uploaded data */}
        <div className={`surface p-4 sm:p-5 transition-colors duration-300 ${siteOfInfection.length > 0 ? 'border-[#5F8D4E]/40 bg-[#F4FFF3]/60' : ''}`}>
          <h3 className="font-semibold text-base mb-2">Summary</h3>
          <div className="text-sm text-gray-600 space-y-1.5">
            <p><span className="font-medium text-gray-800">Patient:</span> {firstName} {lastName}</p>
            <p><span className="font-medium text-gray-800">Photos:</span> 1 clinical, {dermoscopePhotos?.length || 0} dermoscope</p>
            <div>
              <span className="font-medium text-gray-800">Sites selected:</span>
              {siteOfInfection.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {siteOfInfection.map((site) => (
                    <span key={site} className="inline-flex items-center gap-1 text-[#3d6330] font-medium bg-[#5F8D4E]/15 px-2.5 py-0.5 rounded-full text-xs">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {site}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 italic ml-2">Not selected</span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          <Region onSelectSite={handleSiteSelection} />
        </div>

        {/* Validation - only after attempt */}
        {attempted && siteOfInfection.length === 0 && (
          <div className="alert-error" role="alert">
            <span>Please select the site of infection to continue.</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 sm:mt-4">
          <Link href="/step2" className="w-full sm:w-auto order-2 sm:order-1">
            <button type="button" className="btn-secondary w-full sm:w-auto sm:min-w-[140px]">
              Back
            </button>
          </Link>

          <div className="w-full sm:w-auto order-1 sm:order-2">
            {canSubmit() ? (
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto sm:min-w-[180px]">
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? "Creating Patient..." : "Create Patient"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAttempted(true)}
                className="btn-muted w-full sm:w-auto sm:min-w-[180px]"
              >
                Complete All Steps
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
