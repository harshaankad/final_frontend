'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const reportRef = useRef(null);

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
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const baseImageUrl = 'https://dermatology-backend-8xqf.onrender.com';
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

  const initializeImageStates = (reportData) => {
    if (!reportData || imagesInitialized) return;

    const initialImageLoading = {};
    const initialImageErrors = {};
    
    if (reportData.editedNakedEyePhoto) {
      initialImageLoading['nakedEye_0'] = true;
      initialImageErrors['nakedEye_0'] = false;
    }
    
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

  // Function to convert image URL to base64 and get dimensions
  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new window.Image();
        
        reader.onloadend = () => {
          const base64 = reader.result;
          
          // Create image to get natural dimensions
          img.onload = () => {
            resolve({
              data: base64,
              width: img.naturalWidth,
              height: img.naturalHeight
            });
          };
          
          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };
          
          img.src = base64;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  // Function to calculate scaled dimensions maintaining aspect ratio
  const getScaledDimensions = (originalWidth, originalHeight, maxWidth = 550) => {
    // If image is smaller than max width, use original size
    if (originalWidth <= maxWidth) {
      return { width: originalWidth, height: originalHeight };
    }
    
    // Calculate scale ratio
    const ratio = maxWidth / originalWidth;
    
    return {
      width: Math.round(maxWidth),
      height: Math.round(originalHeight * ratio)
    };
  };

  // Function to download as Word document
  const downloadWord = async () => {
    setDownloadingPDF(true);
    
    try {
      // Dynamically import libraries
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, convertInchesToTwip } = await import('docx');

      const children = [];

      // Header with better styling
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Dermoscopy Report',
              bold: true,
              size: 32,
              color: "000000"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 300, before: 200 },
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 24
            }
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Dr ANKAD'S EAGLES EYE Dermoscopy Services" ,
              bold: true,
              size: 24,
              color: "000000"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Bagalkot',
              size: 22,
              color: "000000"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 500 }
        })
      );

      // Patient Info Table with darker borders and better styling
      const patientInfoTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 20, color: "000000" },
          insideVertical: { style: BorderStyle.SINGLE, size: 20, color: "000000" }
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Name: ', bold: true, size: 22, color: "000000" }),
                      new TextRun({ text: `${patient.firstname} ${patient.lastname}`, size: 22, color: "000000" })
                    ],
                    spacing: { before: 100, after: 100 }
                  })
                ],
                width: { size: 33, type: WidthType.PERCENTAGE },
                margins: {
                  top: convertInchesToTwip(0.1),
                  bottom: convertInchesToTwip(0.1),
                  left: convertInchesToTwip(0.15),
                  right: convertInchesToTwip(0.15)
                }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Age / Sex: ', bold: true, size: 22, color: "000000" }),
                      new TextRun({ text: `${patient.age} / ${patient.gender}`, size: 22, color: "000000" })
                    ],
                    spacing: { before: 100, after: 100 }
                  })
                ],
                width: { size: 33, type: WidthType.PERCENTAGE },
                margins: {
                  top: convertInchesToTwip(0.1),
                  bottom: convertInchesToTwip(0.1),
                  left: convertInchesToTwip(0.15),
                  right: convertInchesToTwip(0.15)
                }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Date: ', bold: true, size: 22, color: "000000" }),
                      new TextRun({ text: `${new Date(patient.createdAt).toLocaleDateString()}`, size: 22, color: "000000" })
                    ],
                    spacing: { before: 100, after: 100 }
                  })
                ],
                width: { size: 34, type: WidthType.PERCENTAGE },
                margins: {
                  top: convertInchesToTwip(0.1),
                  bottom: convertInchesToTwip(0.1),
                  left: convertInchesToTwip(0.15),
                  right: convertInchesToTwip(0.15)
                }
              })
            ]
          })
        ]
      });

      children.push(patientInfoTable);
      children.push(new Paragraph({ text: '', spacing: { after: 400 } }));

      // Clinical Details with better formatting
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Site of lesion: ', bold: true, size: 24, color: "000000" }),
            new TextRun({ text: patient.siteOfInfection, size: 24, color: "000000" })
          ],
          spacing: { after: 250 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Duration of Symptoms: ', bold: true, size: 24, color: "000000" }),
            new TextRun({ text: patient.duration, size: 24, color: "000000" })
          ],
          spacing: { after: 250 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Clinical Impression: ', bold: true, size: 24, color: "000000" }),
            new TextRun({ text: report.clinicalImpression, size: 24, color: "000000" })
          ],
          spacing: { after: 500 }
        })
      );

      // Dermoscopic Findings Box with darker borders
      const dermoscopicTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 30, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 30, color: "000000" }
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Dermoscopic findings:',
                        bold: true,
                        size: 26,
                        color: "000000"
                      })
                    ],
                    spacing: { after: 300 }
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: report.dermoscopeFindings,
                        size: 24,
                        color: "000000"
                      })
                    ],
                    spacing: { after: 300 },
                    alignment: AlignmentType.JUSTIFIED
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Impression: ', bold: true, size: 24, color: "000000" }),
                      new TextRun({ text: report.clinicalImpression, size: 24, color: "000000" })
                    ]
                  })
                ],
                margins: {
                  top: convertInchesToTwip(0.2),
                  bottom: convertInchesToTwip(0.2),
                  left: convertInchesToTwip(0.2),
                  right: convertInchesToTwip(0.2)
                }
              })
            ]
          })
        ]
      });

      children.push(dermoscopicTable);
      children.push(new Paragraph({ text: '', spacing: { after: 500 } }));

      // Medical Images Section with better styling
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Medical Images',
              bold: true,
              size: 32,
              color: "000000",
              underline: {}
            })
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 400 },
          border: {
            top: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 24
            }
          }
        })
      );

      // Add Naked Eye Photo
      if (report.editedNakedEyePhoto) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Clinical Eye Photograph',
                bold: true,
                size: 26,
                color: "000000"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          })
        );

        const nakedEyeUrl = getImageUrl(report.editedNakedEyePhoto);
        const nakedEyeImageData = await getBase64Image(nakedEyeUrl);
        
        if (nakedEyeImageData) {
          const dimensions = getScaledDimensions(nakedEyeImageData.width, nakedEyeImageData.height);
          
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: nakedEyeImageData.data,
                  transformation: { 
                    width: dimensions.width, 
                    height: dimensions.height 
                  }
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 500 }
            })
          );
        }
      }

      // Add Dermoscope Photos
      if (report.editedDermoscopePhotos && Array.isArray(report.editedDermoscopePhotos) && report.editedDermoscopePhotos.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Dermoscope Photographs',
                bold: true,
                size: 26,
                color: "000000"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 }
          })
        );

        for (let i = 0; i < report.editedDermoscopePhotos.length; i++) {
          const photo = report.editedDermoscopePhotos[i];
          const photoUrl = getImageUrl(photo);
          const photoImageData = await getBase64Image(photoUrl);
          
          if (photoImageData) {
            const dimensions = getScaledDimensions(photoImageData.width, photoImageData.height);
            
            if (report.editedDermoscopePhotos.length > 1) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Dermoscope Photo ${i + 1}`,
                      bold: true,
                      size: 24,
                      color: "000000"
                    })
                  ],
                  spacing: { before: 300, after: 200 }
                })
              );
            }
            
            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: photoImageData.data,
                    transformation: { 
                      width: dimensions.width, 
                      height: dimensions.height 
                    }
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 500 }
              })
            );
          }
        }
      }

      // Create document
      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      });

      // Generate and save
      const blob = await Packer.toBlob(doc);
      
      // Create download link manually instead of using file-saver
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dermoscopy_Report_${patient.firstname}_${patient.lastname}_${new Date().toLocaleDateString().replace(/\//g, '-')}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
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

  useEffect(() => {
    if (report && !loading) {
      initializeImageStates(report);
    }
  }, [report, loading, imagesInitialized]);

  const ImageSkeleton = () => (
    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
    </div>
  );

  const TextSkeleton = ({ className = "", lines = 1 }) => (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );

  const HeaderSkeleton = () => (
    <div className="text-center space-y-3">
      <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
      <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-1/3"></div>
    </div>
  );

  const PatientInfoSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 border border-gray-200 px-3 sm:px-4 py-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse sm:col-span-2 lg:col-span-1"></div>
    </div>
  );

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
        
        {isLoading && !hasError && (
          <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading image...</div>
          </div>
        )}

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
              setImageLoading(prev => ({
                ...prev,
                [imageKey]: true
              }));
            }}
            unoptimized={true}
            priority={imageKey === 'nakedEye_0'}
          />
        )}
      </div>
    );
  };

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
        <LoadingOverlay />
        
        <div className="w-full">
          <Example />
        </div>
        
        <div className="w-full max-w-6xl border border-gray-200 my-6 md:my-10 mx-4 p-4 md:p-6 space-y-6 text-gray-800 opacity-30">
          <HeaderSkeleton />
          <PatientInfoSkeleton />
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
            <div className="mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
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

      {/* Download Word Button */}
      <div className="w-full max-w-6xl px-4 mt-6 flex justify-end">
        <button
          onClick={downloadWord}
          disabled={downloadingPDF}
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 ${
            downloadingPDF ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#4a7a3a] hover:to-[#3d6330]'
          }`}
        >
          {downloadingPDF ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Document...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </>
          )}
        </button>
      </div>

      {/* Main report container */}
      <div 
        ref={reportRef}
        className="w-full max-w-6xl border border-black my-6 md:my-10 mx-4 p-4 md:p-6 space-y-6 text-gray-800 animate-fade-in"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-base sm:text-lg md:text-xl font-poppins font-bold">
            Dermoscopy Report
          </h2>
          <h3 className="text-sm sm:text-base font-semibold font-poppins">Dr ANKAD'S EAGLES EYE Dermoscopy Services</h3>
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