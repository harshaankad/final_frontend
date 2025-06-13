import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import Example from "@/components/navbar";
import ImageEditor from "@/components/ImageEditor";

export default function AdminGenerate() {
  // Form field data
  const formFields = [
    {
      id: "site1",
      label: "Site of Legion",
      placeholder: "Select user type",
      type: "input",
    },
    {
      id: "clinical",
      label: "Clinical Impression",
      placeholder: "Your first name",
      type: "input",
    },
    {
      id: "duration",
      label: "Duration",
      placeholder: "Your first name",
      type: "input",
    },
    {
      id: "site2",
      label: "Site of Legion",
      placeholder: "Select user type",
      type: "input",
    },
    {
      id: "dermoscopic",
      label: "Dermoscopic Findings",
      placeholder: "Select user type",
      type: "textarea",
    },
    {
      id: "impression",
      label: "Impression",
      placeholder: "Select user type",
      type: "input",
    },
    {
      id: "advice",
      label: "Advice",
      placeholder: "Select user type",
      type: "input",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative">
        {/* Header */}
        <header className="w-full h-[72px]">
          <Example />
        </header>

        {/* Main content */}
        <div className="container px-4 py-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left column - Macroscopic Image */}
            <div className="flex flex-col items-center">
              <h2 className="font-semibold text-2xl text-center text-[#242424] mb-6 [font-family:'Poppins-SemiBold',Helvetica]">
                Edit Macroscopic Image
              </h2>
              <ImageEditor />
            </div>

            {/* Right column - Dermoscopy Image */}
            <div className="flex flex-col items-center">
              <h2 className="font-semibold text-2xl text-center text-[#242424] mb-6 [font-family:'Poppins-SemiBold',Helvetica]">
                Edit Dermoscopy Image
              </h2>
              <ImageEditor />
            </div>
          </div>

          {/* Report Contents Section */}
          <div className="mt-16 max-w-[414px] mx-auto">
            <h2 className="font-semibold text-2xl text-[#242424] text-center mb-8 [font-family:'Poppins-SemiBold',Helvetica]">
              Report Contents
            </h2>

            <div className="space-y-6 mt-10">
              {formFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label
                    htmlFor={field.id}
                    className="font-normal text-[15px] text-[#242424] [font-family:'Poppins-Regular',Helvetica]"
                  >
                    {field.label}
                  </label>

                  {field.type === "input" ? (
                    <Input
                      id={field.id}
                      placeholder={field.placeholder}
                      className="h-[41px] border-grey-100 rounded font-normal text-[13px] text-[#242424] [font-family:'Poppins-Regular',Helvetica]"
                    />
                  ) : (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      className="h-[191px] border-grey rounded font-normal text-[13px] text-[#242424] [font-family:'Poppins-Regular',Helvetica]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Button className="bg-green text-white font-semibold text-[13px] transform transition-transform hover:scale-105 hover:shadow-lg h-[47px] w-[150px] [font-family:'Poppins-SemiBold',Helvetica]">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
