'use client'

import { createContext, useContext, useState } from 'react'

export const AppContext = createContext()

export function ContextProvider({ children }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [duration, setDuration] = useState('')
  const [previousTreatment, setPreviousTreatment] = useState('')

  // For Step 2 - Image Uploads
  const [nakedEyePhoto, setNakedEyePhoto] = useState(null)
  const [dermoscopePhotos, setDermoscopePhotos] = useState([]) // array for multiple images
  const [nakedEyePreview, setNakedEyePreview] = useState(null)
  const [dermoscopePreviews, setDermoscopePreviews] = useState([]) // array for multiple previews

  // For Step 3
  const [siteOfInfection, setSiteOfInfection] = useState('')

  // For Step 4
  const [patientId, setPatientId] = useState(null)
  const [doctorId, setDoctorId] = useState(null)


  return (
    <AppContext.Provider value={{
      firstName,
      setFirstName,
      lastName,
      setLastName,
      age,
      setAge,
      gender,
      setGender,
      patientId,
      setPatientId,
      doctorId,
      setDoctorId,
      duration,
      setDuration,
      previousTreatment,
      setPreviousTreatment,

      // Step 2 - images
      nakedEyePhoto,
      setNakedEyePhoto,
      dermoscopePhotos,
      setDermoscopePhotos,
      nakedEyePreview,
      setNakedEyePreview,
      dermoscopePreviews,
      setDermoscopePreviews,

      // Step 3
      siteOfInfection,
      setSiteOfInfection,

    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useForm() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useForm must be used within a ContextProvider')
  }
  return context
}
