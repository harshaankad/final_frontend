'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Example from '@/components/navbar';
import Spinner from '@/components/Spinner';

export default function Report() {
  const { patientId } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [imagesInitialized, setImagesInitialized] = useState(false);

  const BASE_URL = 'https://dermatology-backend-8xqf.onrender.com/api';

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  // Function to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the full URL
    const baseImageUrl = 'https://dermatology-backend-8xqf.onrender.com'; // Adjust this to match your backend
    return `${baseImageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const handleImageError = (imageKey) => {
    setImageErrors(prev => ({
      ...prev,
      [imageKey]: true
    }));
    setImageLoading(prev => ({
      ...prev,
      [imageKey]: false
    }));
    console.error(`Failed to load image: ${imageKey}`);
  };

  const handleImageLoad = (imageKey) => {
    setImageLoading(prev => ({
      ...prev,
      [imageKey]: false
    }));
  };

  // Initialize image loading states when images are about to be rendered
  const initializeImageStates = (reportData) => {
    if (!reportData || imagesInitialized) return;

    const initialImageLoading = {};
    const initialImageErrors = {};
    
    // Handle naked eye photo (single photo)
    if (reportData.editedNakedEyePhoto) {
      initialImageLoading['nakedEye_0'] = true;
      initialImageErrors['nakedEye_0'] = false;
    }
    
    // Handle dermoscope photos (array of photos)
    if (reportData.editedDermoscopePhotos && Array.isArray(reportData.editedDermoscopePhotos)) {
      reportData.editedDermoscopePhotos.forEach((_, index) => {
        initialImageLoading[`dermoscope_${index}`] = true;
        initialImageErrors[`dermoscope_${index}`] = false;
      });
    }
    
    setImageLoading(initialImageLoading);
    setImageErrors(initialImageErrors);
    setImagesInitialized(true);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/patient-details/${patientId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch data');
        }

        setPatient(data.data.patient);
        setReport(data.data.report);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  // Initialize image states when report data is available
  useEffect(() => {
    if (report && !loading) {
      initializeImageStates(report);
    }
  }, [report, loading, imagesInitialized]);

  // Skeleton component for images
  const ImageSkeleton = () => (
    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
    </div>
  );

  // Text skeleton component
  const TextSkeleton = ({ className = "", lines = 1 }) => (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );

  // Header skeleton
  const HeaderSkeleton = () => (
    <div className="text-center space-y-3">
      <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
      <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-1/3"></div>
    </div>
  );

  // Patient info skeleton
  const PatientInfoSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 border border-gray-200 px-3 sm:px-4 py-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse sm:col-span-2 lg:col-span-1"></div>
    </div>
  );

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm mx-4">
        <Spinner />
        <div className="text-lg font-semibold text-gray-800">Loading Report...</div>
        <div className="text-sm text-gray-600 text-center">
          Please wait while we fetch the patient data
        </div>
      </div>
    </div>
  );

  // Render individual image with proper loading states
  const renderImage = (imagePath, imageKey, altText, title) => {
    const imageUrl = getImageUrl(imagePath);
    const isLoading = imageLoading[imageKey];
    const hasError = imageErrors[imageKey];
    
    if (!imageUrl) return null;

    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md relative">
        {title && (
          <h5 className="text-base font-medium mb-3 font-poppins text-gray-700">
            {title}
          </h5>
        )}
        
        {/* Loading skeleton - only show if loading and no error */}
        {isLoading && !hasError && (
          <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading image...</div>
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="w-full h-64 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500 p-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image failed to load</p>
            </div>
          </div>
        )}

        {/* Actual image - hide while loading or if error */}
        {!hasError && (
          <Image
            src={imageUrl}
            alt={altText}
            width={0}
            height={0}
            sizes="100vw"
            className={`h-auto max-w-full transition-opacity duration-300 ${
              isLoading ? 'opacity-0 absolute' : 'opacity-100'
            }`}
            style={{ width: 'auto', height: 'auto' }}
            onError={() => handleImageError(imageKey)}
            onLoad={() => handleImageLoad(imageKey)}
            onLoadStart={() => {
              // Ensure loading state is set when image starts loading
              setImageLoading(prev => ({
                ...prev,
                [imageKey]: true
              }));
            }}
            unoptimized={true}
            priority={imageKey === 'nakedEye_0'} // Prioritize first image
          />
        )}
      </div>
    );
  };

  // Render photo gallery section
  const renderPhotoGallery = () => {
    if (!report) return null;

    const hasNakedEyePhoto = report.editedNakedEyePhoto;
    const dermoscopePhotos = report.editedDermoscopePhotos && Array.isArray(report.editedDermoscopePhotos) 
      ? report.editedDermoscopePhotos 
      : [];

    if (!hasNakedEyePhoto && dermoscopePhotos.length === 0) return null;

    return (
      <div className="mt-8 space-y-8">
        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold underline text-center mb-8 font-poppins">
            Medical Images
          </h3>
          
          {/* Naked Eye Photo Section */}
          {hasNakedEyePhoto && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 font-poppins text-gray-800">
                Clinical Eye Photograph
              </h4>
              <div className="flex justify-center">
                {renderImage(
                  report.editedNakedEyePhoto,
                  'nakedEye_0',
                  'Naked Eye Photo'
                )}
              </div>
            </div>
          )}

          {/* Dermoscope Photos Section */}
          {dermoscopePhotos.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 font-poppins text-gray-800">
                Dermoscope Photographs
              </h4>
              <div className="space-y-6">
                {dermoscopePhotos.map((photo, index) => {
                  const key = `dermoscope_${index}`;
                  return (
                    <div key={key} className="animate-slide-in-up">
                      <div className="flex justify-center">
                        {renderImage(
                          photo,
                          key,
                          `Dermoscope Photo ${index + 1}`,
                          dermoscopePhotos.length > 1 ? `Dermoscope Photo ${index + 1}` : null
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen font-poppins flex flex-col items-center relative">
        {/* Loading overlay */}
        <LoadingOverlay />
        
        <div className="w-full">
          <Example />
        </div>
        
        {/* Skeleton content */}
        <div className="w-full max-w-6xl border border-gray-200 my-6 md:my-10 mx-4 p-4 md:p-6 space-y-6 text-gray-800 opacity-30">
          {/* Header skeleton */}
          <HeaderSkeleton />
          {/* Patient info skeleton */}
          <PatientInfoSkeleton />
          {/* Clinical details skeleton */}
          <div className="px-3 sm:px-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-full min-h-screen font-poppins flex flex-col items-center">
        <div className="w-full">
          <Example />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-10 px-4">
            <div className="text-red-500 text-lg md:text-xl mb-4">
              Oops! Something went wrong
            </div>
            <div className="text-red-400 text-sm md:text-base">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white w-full min-h-screen font-poppins flex flex-col items-center">
        <div className="w-full">
          <Example />
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            {/* Animated pulse icon */}
            <div className="mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            {/* Animated text */}
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 animate-fade-in-up">
                Report Generation in Progress
              </h3>
              <p className="text-base md:text-lg text-gray-500 animate-fade-in-up animation-delay-200">
                Your dermoscopy analysis is being prepared
              </p>
              <p className="text-sm md:text-base text-gray-400 animate-fade-in-up animation-delay-400">
                Please check back in a few moments
              </p>
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-1 mt-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full font-poppins min-h-screen flex flex-col items-center">
      <div className="w-full">
        <Example />
      </div>

      {/* Main report container */}
      <div className="w-full max-w-6xl border border-black my-6 md:my-10 mx-4 p-4 md:p-6 space-y-6 text-gray-800 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-base sm:text-lg md:text-xl font-poppins font-bold">
            Ankad Cutiscience (Dermoscopy Analysis)
          </h2>
          <h3 className="text-sm sm:text-base font-semibold font-poppins">Dr B S Ankad</h3>
          <p className="text-xs sm:text-sm md:text-base font-medium font-poppins">Bagalkot</p>
        </div>

        {/* Patient info grid */}
        <div className="grid font-poppins grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 border border-black px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium">
          <p className="break-words">
            <strong>Name:</strong> {patient.firstname} {patient.lastname}
          </p>
          <p>
            <strong>Age / Sex:</strong> {patient.age} / {patient.gender}
          </p>
          <p className="sm:col-span-2 lg:col-span-1">
            <strong>Date:</strong>{' '}
            {new Date(patient.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Clinical details */}
        <div className="px-3 sm:px-4 text-xs sm:text-sm space-y-2 font-poppins">
          <p className="break-words">
            <strong>Site of lesion:</strong> {patient.siteOfInfection}
          </p>
          <p>
            <strong>Duration of Symptoms:</strong> {patient.duration}
          </p>
          <p className="break-words">
            <strong>Clinical Impression:</strong> {report.clinicalImpression}
          </p>
        </div>

        {/* Dermoscopic findings - Full width */}
        <div className="border border-black p-3 sm:p-4 space-y-2 sm:space-y-4 font-poppins">
          <p className="font-semibold text-base sm:text-lg md:text-xl font-poppins mb-4 sm:mb-6">
            Dermoscopic findings:
          </p>
          <p className="break-words leading-relaxed text-xs sm:text-sm">{report.dermoscopeFindings}</p>
          <p className="break-words text-xs sm:text-sm">
            <strong>Impression:</strong> {report.clinicalImpression}
          </p>
        </div>

        {/* Photo Gallery Section */}
        {renderPhotoGallery()}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}