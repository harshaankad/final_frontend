'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Example from '@/components/navbar';
import ImageEditor from '@/components/ImageEditor';
import Spinner from '@/components/Spinner';
import { Download, CheckCircle2, Circle } from 'lucide-react';
import { apiFetch, isLoggedIn } from "@/lib/auth";

export default function AdminGenerate() {
  const { patientId } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dermoscopeFindings, setDermoscopeFindings] = useState('');
  const [clinicalImpression, setClinicalImpression] = useState('');
  const [editedNakedEyeFile, setEditedNakedEyeFile] = useState(null);
  const [editedDermoscopeFiles, setEditedDermoscopeFiles] = useState([]);
  const [nakedEyeSaved, setNakedEyeSaved] = useState(false);
  const [dermoscopeSavedStates, setDermoscopeSavedStates] = useState([]);
  const [formError, setFormError] = useState('');



  useEffect(() => {
    const fetchPatient = async () => {
      if (!isLoggedIn()) {
        router.push('/login');
        return;
      }

      try {
        const res = await apiFetch(`/patient-details/${patientId}`);
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch patient data');
        }

        setPatient(data.data.patient);

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
    setEditedNakedEyeFile(file);
    setNakedEyeSaved(true);
  };

  const handleDermoscopeEditComplete = (file, index) => {
    setEditedDermoscopeFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });

    setDermoscopeSavedStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  const downloadImage = (file, fileName) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadNakedEye = () => {
    const fileName = `${patient.firstname}_${patient.lastname}_macroscopic_edited.jpg`;
    downloadImage(editedNakedEyeFile, fileName);
  };

  const handleDownloadDermoscope = (index) => {
    const fileName = `${patient.firstname}_${patient.lastname}_dermoscopic_${index + 1}_edited.jpg`;
    downloadImage(editedDermoscopeFiles[index], fileName);
  };

  const areAllDermoscopesSaved = () => {
    return dermoscopeSavedStates.length > 0 && dermoscopeSavedStates.every(saved => saved);
  };

  const areAllDermoscopeFilesReady = () => {
    return editedDermoscopeFiles.length > 0 && editedDermoscopeFiles.every(file => file !== null);
  };

  const handleGenerate = async () => {
    setFormError('');

    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    if (!editedNakedEyeFile || !nakedEyeSaved) {
      setFormError('Please edit and save the macroscopic image before generating the report.');
      return;
    }

    if (!areAllDermoscopeFilesReady() || !areAllDermoscopesSaved()) {
      setFormError('Please edit and save all dermoscopic images before generating the report.');
      return;
    }

    if (!dermoscopeFindings.trim() || !clinicalImpression.trim()) {
      setFormError('Please fill in dermoscopic findings and clinical impression.');
      return;
    }

    setGenerating(true);

    const formData = new FormData();
    formData.append('dermoscopeFindings', dermoscopeFindings);
    formData.append('clinicalImpression', clinicalImpression);
    formData.append('digitalSignature', 'SignedByAdmin');
    formData.append('editedNakedEyePhoto', editedNakedEyeFile);

    editedDermoscopeFiles.forEach((file) => {
      formData.append('editedDermoscopePhotos', file);
    });

    try {
      const res = await apiFetch(`/admin-generate-report/${patientId}`, { method: 'POST', body: formData });

      const result = await res.json();

      if (!res.ok) {
        setFormError(result.message || 'Error generating report');
      } else {
        router.push('/patients');
      }
    } catch (err) {
      setFormError('Something went wrong while submitting the report.');
    } finally {
      setGenerating(false);
    }
  };

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

  const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm mx-4">
        <div className="py-4"><Spinner color="#5F8D4E" /></div>
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
            <div>
              <div className="h-6 sm:h-7 bg-gray-200 animate-pulse rounded mb-4 w-48"></div>
              <ImageSkeleton />
            </div>
            <div>
              <div className="h-6 sm:h-7 bg-gray-200 animate-pulse rounded mb-4 w-48"></div>
              <ImageSkeleton />
            </div>
          </div>

          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto space-y-4 border-2 p-4 sm:p-6 rounded">
            <TextSkeleton lines={5} height="h-5" />
          </div>

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
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          <div className="text-center text-red-600 text-lg sm:text-xl">Patient not found</div>
          <p className="text-sm text-gray-500">The patient may have been removed or the link is invalid.</p>
          <button
            onClick={() => router.push('/patients')}
            className="text-sm font-semibold text-[#5F8D4E] hover:underline"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col min-h-screen relative">
      {generating && <LoadingOverlay />}

      <header className="w-full">
        <Example />
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col space-y-8">
          {/* Naked Eye Image Editor */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center gap-2 text-center">
              <span>Edit Macroscopic Image</span>
              {nakedEyeSaved && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F4FFF3] px-2.5 py-0.5 text-xs font-medium text-[#3d6330]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                </span>
              )}
            </h2>
            <div className="flex justify-center">
              <div className="w-full">
                <ImageEditor
                  imageUrl={patient.nakedEyePhoto}
                  onEditComplete={handleNakedEyeEditComplete}
                  downloadButton={
                    <button
                      type="button"
                      onClick={handleDownloadNakedEye}
                      disabled={!nakedEyeSaved || !editedNakedEyeFile}
                      className="btn-secondary h-10 sm:h-10 px-4 text-sm sm:text-sm"
                    >
                      <Download size={16} />
                      Download Image
                    </button>
                  }
                />
              </div>
            </div>
          </div>

          {/* Multiple Dermoscope Image Editors */}
          {patient.dermoscopePhotos.map((dermoscopeUrl, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center gap-2 text-center">
                <span>Edit Dermoscopic Image {patient.dermoscopePhotos.length > 1 ? `${index + 1}` : ''}</span>
                {dermoscopeSavedStates[index] && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F4FFF3] px-2.5 py-0.5 text-xs font-medium text-[#3d6330]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
              </h2>
              <div className="flex justify-center">
                <div className="w-full">
                  <ImageEditor
                    imageUrl={dermoscopeUrl}
                    onEditComplete={(file) => handleDermoscopeEditComplete(file, index)}
                    downloadButton={
                      <button
                        type="button"
                        onClick={() => handleDownloadDermoscope(index)}
                        disabled={!dermoscopeSavedStates[index] || !editedDermoscopeFiles[index]}
                        className="btn-secondary h-10 sm:h-10 px-4 text-sm sm:text-sm"
                      >
                        <Download size={16} />
                        Download Image
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Info (Read-only) */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <div className="surface bg-gray-50/60 p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-700">
              <div><strong>Name:</strong> {patient.firstname} {patient.lastname}</div>
              <div><strong>Gender / Age:</strong> <span className="capitalize">{patient.gender}</span> / {patient.age}</div>
              <div><strong>Site of Lesion:</strong> {patient.siteOfInfection}</div>
              <div><strong>Duration:</strong> {patient.duration}</div>
              <div className="sm:col-span-2"><strong>Previous Treatment:</strong> {patient.previousTreatment || 'None'}</div>
              <div className="sm:col-span-2"><strong>Clinical Impression:</strong> {patient.clinicalImpression || 'None'}</div>
              <div className="sm:col-span-2"><strong>Images:</strong> 1 Macroscopic, {patient.dermoscopePhotos.length} Dermoscopic</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <div className="surface p-5 sm:p-6 space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Report Details</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="field-label" htmlFor="clinicalImpression">
                  Final Impression *
                </label>
                <Input
                  id="clinicalImpression"
                  value={clinicalImpression}
                  onChange={(e) => setClinicalImpression(e.target.value)}
                  placeholder="e.g. Possible early-stage melanoma"
                  className=""
                />
              </div>

              <div className="space-y-2 lg:row-span-2">
                <label className="field-label" htmlFor="dermoscopeFindings">
                  Dermoscopic Findings *
                </label>
                <Textarea
                  id="dermoscopeFindings"
                  value={dermoscopeFindings}
                  onChange={(e) => setDermoscopeFindings(e.target.value)}
                  placeholder="Describe the dermoscopic findings from all images..."
                  className="h-40"
                />
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2.5 text-gray-900">Progress</h4>
              <div className="space-y-1.5 text-sm">
                {[
                  { done: nakedEyeSaved, label: 'Macroscopic image edited and saved' },
                  ...patient.dermoscopePhotos.map((_, index) => ({
                    done: !!dermoscopeSavedStates[index],
                    label: `Dermoscopic image ${patient.dermoscopePhotos.length > 1 ? `${index + 1} ` : ''}edited and saved`,
                  })),
                  { done: !!dermoscopeFindings.trim(), label: 'Dermoscopic findings entered' },
                  { done: !!clinicalImpression.trim(), label: 'Clinical impression entered' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 ${item.done ? 'text-[#3d6330]' : 'text-gray-500'}`}>
                    {item.done
                      ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#5F8D4E]" />
                      : <Circle className="h-4 w-4 flex-shrink-0 text-gray-300" />}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {formError && (
              <div className="alert-error" role="alert">
                <span>{formError}</span>
                <button onClick={() => setFormError('')} className="text-red-500 hover:text-red-700" aria-label="Dismiss">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 justify-center">
              <Button
                onClick={handleGenerate}
                disabled={
                  generating ||
                  !nakedEyeSaved ||
                  !areAllDermoscopesSaved() ||
                  !dermoscopeFindings.trim() ||
                  !clinicalImpression.trim()
                }
                className="w-full sm:w-auto sm:min-w-[200px]"
              >
                {generating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
