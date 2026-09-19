"use client"
import { useState } from "react";
import Link from "next/link";
import { useForm } from '../../context/context';
import Example from "@/components/navbar";
import Stepper from "@/components/Stepper";

export default function Step1() {
  const [attempted, setAttempted] = useState(false);

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,
    gender,
    setGender,
    duration,
    setDuration,
    previousTreatment,
    setPreviousTreatment,
    clinicalImpression,
    setClinicalImpression,
  } = useForm();

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "First-Name":
        setFirstName(value);
        break;
      case "Last-Name":
        setLastName(value);
        break;
      case "age":
        // Only allow positive integers
        const ageVal = value.replace(/[^0-9]/g, "");
        if (ageVal === "" || (parseInt(ageVal) >= 1 && parseInt(ageVal) <= 120)) {
          setAge(ageVal);
        }
        break;
      case "gender":
        setGender(value);
        break;
      case "duration":
        setDuration(value);
        break;
      case "previousTreatment":
        setPreviousTreatment(value);
        break;
      case "clinicalImpression":
        setClinicalImpression(value);
        break;
      default:
        break;
    }
  };

  const isFormValid = () => {
    return firstName.trim() !== '' &&
           lastName.trim() !== '' &&
           age !== '' &&
           gender !== '' &&
           duration.trim() !== '' &&
           previousTreatment.trim() !== '' &&
           clinicalImpression.trim() !== '';
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      <Stepper current={1} />

      {/* FORM */}
      <form className="flex flex-col w-full max-w-4xl mx-auto mt-4 sm:mt-6 text-black px-4 sm:px-6 pb-10 gap-5 sm:gap-6">
        <h1 className="text-left text-xl sm:text-2xl lg:text-3xl font-medium text-black my-4 sm:my-8">
          Basic Information
        </h1>

        {/* Name Fields */}
        <div className="w-full flex flex-col sm:flex-row gap-5 sm:gap-6">
          <div className="flex flex-col flex-1">
            <label htmlFor="firstName" className="field-label">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="First-Name"
              placeholder="Enter first name"
              value={firstName}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="lastName" className="field-label">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="Last-Name"
              placeholder="Enter last name"
              value={lastName}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>
        </div>

        {/* Age and Gender Fields */}
        <div className="w-full flex flex-col sm:flex-row gap-5 sm:gap-6">
          <div className="flex flex-col flex-1">
            <label htmlFor="age" className="field-label">Age *</label>
            <input
              type="text"
              inputMode="numeric"
              id="age"
              name="age"
              placeholder="Enter age"
              value={age}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="gender" className="field-label">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Duration and Previous Treatment Fields */}
        <div className="w-full flex flex-col sm:flex-row gap-5 sm:gap-6">
          <div className="flex flex-col flex-1">
            <label htmlFor="duration" className="field-label">Duration *</label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="e.g., 2 weeks, 1 month"
              value={duration}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="previousTreatment" className="field-label">Previous Treatment *</label>
            <input
              type="text"
              id="previousTreatment"
              name="previousTreatment"
              placeholder="Describe any previous treatments"
              value={previousTreatment}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>
        </div>

        {/* Clinical Impression */}
        <div className="w-full flex flex-col">
          <label htmlFor="clinicalImpression" className="field-label">Clinical Impression *</label>
          <textarea
            id="clinicalImpression"
            name="clinicalImpression"
            placeholder="Enter clinical impression"
            value={clinicalImpression}
            onChange={handleChange}
            rows={3}
            className="field-textarea"
            required
          />
        </div>

        {/* Validation Message - only after user tries to proceed */}
        {attempted && !isFormValid() && (
          <div className="alert-error" role="alert">
            <span>Please fill in all required fields to continue.</span>
          </div>
        )}

        {/* Next Button */}
        <div className="flex flex-row justify-center sm:justify-end items-center mt-2 sm:mt-4">
          {isFormValid() ? (
            <Link href="/step2" className="w-full sm:w-auto">
              <button type="button" className="btn-primary w-full sm:w-auto sm:min-w-[160px]">
                Next Step
              </button>
            </Link>
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
      </form>
    </div>
  );
}
