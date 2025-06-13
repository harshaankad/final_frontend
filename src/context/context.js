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
  const [dermoscopePhoto, setDermoscopePhoto] = useState(null)
  const [nakedEyePreview, setNakedEyePreview] = useState(null)
  const [dermoscopePreview, setDermoscopePreview] = useState(null)

  // For Step 3

  const [siteOfInfection, setSiteOfInfection] = useState('');

  // For step 4

  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);


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
      dermoscopePhoto,
      setDermoscopePhoto,
      nakedEyePreview,
      setNakedEyePreview,
      dermoscopePreview,
      setDermoscopePreview,

      //Step 3
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
