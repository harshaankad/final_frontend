'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Example from '@/components/navbar';
import ImageEditor from '@/components/ImageEditor';
import Spinner from '@/components/Spinner';

export default function AdminGenerate() {
  const { patientId } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dermoscopeFindings, setDermoscopeFindings] = useState('');
  const [clinicalImpression, setClinicalImpression] = useState('');
  const [editedNakedEyeFile, setEditedNakedEyeFile] = useState(null);
  const [editedDermoscopeFiles, setEditedDermoscopeFiles] = useState([]); // Changed to array
  const [nakedEyeSaved, setNakedEyeSaved] = useState(false);
  const [dermoscopeSavedStates, setDermoscopeSavedStates] = useState([]); // Array of saved states

  const BASE_URL = 'https://dermatology-backend-8xqf.onrender.com/api';

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  useEffect(() => {
    const fetchPatient = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/patient-details/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch patient data');
        }

        setPatient(data.data.patient);
        
        // Initialize dermoscope files and saved states arrays based on number of photos
        if (data.data.patient.dermoscopePhotos) {
          const photosCount = data.data.patient.dermoscopePhotos.length;
          setEditedDermoscopeFiles(new Array(photosCount).fill(null));
          setDermoscopeSavedStates(new Array(photosCount).fill(false));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPatient();
  }, [patientId, router]);

  const handleNakedEyeEditComplete = (file) => {
    console.log('Naked eye edit complete:', file);
    setEditedNakedEyeFile(file);
    setNakedEyeSaved(true);
  };

  const handleDermoscopeEditComplete = (file, index) => {
    console.log(`Dermoscope ${index} edit complete:`, file);
    
    // Update the specific file at the given index
    setEditedDermoscopeFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });

    // Update the saved state for this specific dermoscope
    setDermoscopeSavedStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  // Check if all dermoscope photos are saved
  const areAllDermoscopesSaved = () => {
    return dermoscopeSavedStates.length > 0 && dermoscopeSavedStates.every(saved => saved);
  };

  // Check if all dermoscope files exist
  const areAllDermoscopeFilesReady = () => {
    return editedDermoscopeFiles.length > 0 && editedDermoscopeFiles.every(file => file !== null);
  };

  const handleGenerate = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Debug logging
    console.log('=== FRONTEND DEBUG ===');
    console.log('dermoscopeFindings:', dermoscopeFindings);
    console.log('clinicalImpression:', clinicalImpression);
    console.log('editedNakedEyeFile:', editedNakedEyeFile);
    console.log('editedDermoscopeFiles:', editedDermoscopeFiles);
    console.log('dermoscopeSavedStates:', dermoscopeSavedStates);

    // Validation before sending
    if (!dermoscopeFindings.trim() || !clinicalImpression.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editedNakedEyeFile) {
      alert('Please edit and save the naked eye image before generating the report.');
      return;
    }

    if (!areAllDermoscopeFilesReady()) {
      alert('Please edit and save all dermoscope images before generating the report.');
      return;
    }

    if (!nakedEyeSaved || !areAllDermoscopesSaved()) {
      alert('Please make sure all images have been saved after editing.');
      return;
    }

    setGenerating(true);

    const formData = new FormData();
    formData.append('dermoscopeFindings', dermoscopeFindings);
    formData.append('clinicalImpression', clinicalImpression);
    formData.append('digitalSignature', 'SignedByAdmin'); 
    formData.append('editedNakedEyePhoto', editedNakedEyeFile);
    
    // Append all edited dermoscope files
    editedDermoscopeFiles.forEach((file, index) => {
      formData.append('editedDermoscopePhotos', file);
    });

    // Debug FormData contents
    console.log('=== FORMDATA CONTENTS ===');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
      if (value instanceof File) {
        console.log(`${key} - File name: ${value.name}, size: ${value.size}, type: ${value.type}`);
      }
    }

    try {
      console.log('Sending request to:', `${BASE_URL}/admin-generate-report/${patientId}`);
      
      const res = await fetch(`${BASE_URL}/admin-generate-report/${patientId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      console.log('Response:', result);

      if (!res.ok) {
        alert(result.message || 'Error generating report');
      } else {
        router.push('/patients');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong while submitting the report.');
    } finally {
      setGenerating(false);
    }
  };

  // Skeleton loader components
  const ImageSkeleton = () => (
    <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
  );

  const TextSkeleton = ({ lines = 1, height = "h-4" }) => (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className={`bg-gray-200 animate-pulse rounded ${height} w-full`}></div>
      ))}
    </div>
  );

  // Loading Overlay Component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm mx-4">
        <Spinner />
        <div className="text-lg font-semibold text-gray-800">Generating Report...</div>
        <div className="text-sm text-gray-600 text-center">
          Please wait while we process your request
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white flex flex-col min-h-screen">
        <header className="w-full">
          <Example />
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Image Editor Skeletons */}
            <div>
              <div className="h-6 sm:h-7 bg-gray-200 animate-pulse rounded mb-4 w-48"></div>
              <ImageSkeleton />
            </div>
            <div>
              <div className="h-6 sm:h-7 bg-gray-200 animate-pulse rounded mb-4 w-48"></div>
              <ImageSkeleton />
            </div>
          </div>

          {/* Patient Info Skeleton */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto space-y-4 border-2 p-4 sm:p-6 rounded">
            <TextSkeleton lines={5} height="h-5" />
          </div>

          {/* Form Section Skeleton */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto space-y-6">
            <div>
              <TextSkeleton height="h-5" />
              <div className="mt-2">
                <TextSkeleton height="h-10" />
              </div>
            </div>
            <div>
              <TextSkeleton height="h-5" />
              <div className="mt-2">
                <TextSkeleton height="h-40" />
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 sm:w-40 h-12 bg-gray-200 animate-pulse rounded mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white flex flex-col min-h-screen">
        <header className="w-full">
          <Example />
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-red-600 text-lg sm:text-xl">Patient not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col min-h-screen relative">
      {/* Loading Overlay */}
      {generating && <LoadingOverlay />}
      
      <header className="w-full">
        <Example />
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Vertical Layout - Images stacked one below another */}
        <div className="flex flex-col space-y-8">
          {/* Naked Eye Image Editor */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-black flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
              <span>Edit Macroscopic Image</span>
              {nakedEyeSaved && <span className="text-green-600 text-sm mt-1 sm:mt-0 sm:ml-2">✓ Saved</span>}
            </h2>
            <div className="flex justify-center">
              <div className="inline-block">
                <ImageEditor
                  imageUrl={patient.nakedEyePhoto}
                  onEditComplete={handleNakedEyeEditComplete}
                  preserveOriginalSize={true}
                />
              </div>
            </div>
          </div>
          
          {/* Multiple Dermoscope Image Editors */}
          {patient.dermoscopePhotos.map((dermoscopeUrl, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-black flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
                <span>Edit Dermoscopic Image {patient.dermoscopePhotos.length > 1 ? `${index + 1}` : ''}</span>
                {dermoscopeSavedStates[index] && <span className="text-green-600 text-sm mt-1 sm:mt-0 sm:ml-2">✓ Saved</span>}
              </h2>
              <div className="flex justify-center">
                <div className="inline-block">
                  <ImageEditor
                    imageUrl={dermoscopeUrl}
                    onEditComplete={(file) => handleDermoscopeEditComplete(file, index)}
                    preserveOriginalSize={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Info (Read-only) */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <div className="bg-gray-50 border-2 border-gray-200 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-800">
              <div><strong>Name:</strong> {patient.firstname} {patient.lastname}</div>
              <div><strong>Gender / Age:</strong> {patient.gender} / {patient.age}</div>
              <div><strong>Site of Lesion:</strong> {patient.siteOfInfection}</div>
              <div><strong>Duration:</strong> {patient.duration}</div>
              <div className="sm:col-span-2"><strong>Previous Treatment:</strong> {patient.previousTreatment || 'None'}</div>
              <div className="sm:col-span-2"><strong>Images:</strong> 1 Macroscopic, {patient.dermoscopePhotos.length} Dermoscopic</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 rounded-lg space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-4">Report Details</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block font-medium text-black text-sm sm:text-base" htmlFor="clinicalImpression">
                  Clinical Impression *
                </label>
                <Input
                  id="clinicalImpression"
                  value={clinicalImpression}
                  onChange={(e) => setClinicalImpression(e.target.value)}
                  placeholder="e.g. Possible early-stage melanoma"
                  className="w-full text-black text-sm sm:text-base h-10 sm:h-11"
                />
              </div>

              <div className="space-y-2 lg:row-span-2">
                <label className="block font-medium text-black text-sm sm:text-base" htmlFor="dermoscopeFindings">
                  Dermoscopic Findings *
                </label>
                <Textarea
                  id="dermoscopeFindings"
                  value={dermoscopeFindings}
                  onChange={(e) => setDermoscopeFindings(e.target.value)}
                  placeholder="Describe the dermoscopic findings from all images..."
                  className="w-full h-32 text-black sm:h-40 lg:h-full text-sm sm:text-base resize-none"
                />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Progress:</h4>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center ${nakedEyeSaved ? 'text-green-600' : 'text-gray-500'}`}>
                  {nakedEyeSaved ? '✓' : '○'} Macroscopic image edited and saved
                </div>
                {patient.dermoscopePhotos.map((_, index) => (
                  <div key={index} className={`flex items-center ${dermoscopeSavedStates[index] ? 'text-green-600' : 'text-gray-500'}`}>
                    {dermoscopeSavedStates[index] ? '✓' : '○'} Dermoscopic image {patient.dermoscopePhotos.length > 1 ? `${index + 1} ` : ''}edited and saved
                  </div>
                ))}
                <div className={`flex items-center ${dermoscopeFindings.trim() ? 'text-green-600' : 'text-gray-500'}`}>
                  {dermoscopeFindings.trim() ? '✓' : '○'} Dermoscopic findings entered
                </div>
                <div className={`flex items-center ${clinicalImpression.trim() ? 'text-green-600' : 'text-gray-500'}`}>
                  {clinicalImpression.trim() ? '✓' : '○'} Clinical impression entered
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t justify-center">
              <Button
                onClick={handleGenerate}
                disabled={
                  generating || 
                  !nakedEyeSaved || 
                  !areAllDermoscopesSaved() || 
                  !dermoscopeFindings.trim() || 
                  !clinicalImpression.trim()
                }
                className="w-full sm:w-auto font-bold text-lg sm:text-xl h-[49px] sm:h-[49px] rounded-[7px] px-6 sm:px-5 py-2.5 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <span className="relative z-10">
                  Generate Report
                  {(!nakedEyeSaved || !areAllDermoscopesSaved()) && 
                    <span className="block sm:inline text-xs mt-1 sm:mt-0 sm:ml-2">
                      (Save {!nakedEyeSaved ? 'macroscopic' : ''} {!nakedEyeSaved && !areAllDermoscopesSaved() ? 'and ' : ''} {!areAllDermoscopesSaved() ? 'all dermoscopic ' : ''}images first)
                    </span>
                  }
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}