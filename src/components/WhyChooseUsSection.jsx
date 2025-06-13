import { CheckCircle } from "lucide-react";
import React from "react";

export default function WhyChooseUsSection() {
  const features = [
    {
      id: 1,
      title: "Experience",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor, id sed",
    },
    {
      id: 2,
      title: "Commitment",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor, id sed",
    },
    {
      id: 3,
      title: "Facilities",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor, id sed",
    },
    {
      id: 4,
      title: "Relationships",
      description:
        "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor, id sed",
    },
  ];

  return (
    <section className="w-full max-w-[1086px] mx-auto py-16 px-4">
      <div className="flex flex-col items-center mb-12 px-2">
        <h2 className="font-h-2 text-4xl font-bold text-[#242424] text-center max-w-[890px] mb-4">
          Why should you take our services?
        </h2>

        <p className="font-paragraph text-[#5A5A5A] pt-4 text-center max-w-[471px]">
          Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis
          ullamcorper quis. Quam enim tortor, id sed
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 pr-8">
          <img
            className="w-full h-[485px] object-cover rounded-md"
            alt="People in a classroom setting"
            src="/clinic.jpg" // add a valid image source here
          />
        </div>

        <div className="w-full md:w-1/2 space-y-12">
          {features.map((feature) => (
            <div key={feature.id} className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 w-0.5 h-full bg-[#242424] opacity-100"></div>

              <div className="mb-2 flex items-center">
                <h3 className="font-bold text-brandGreen text-2xl tracking-[0.40px]">
                  {feature.title}
                </h3>
                <CheckCircle className="w-[17px] h-[17px] ml-2 text-brandGreen" />
              </div>

              <p className="font-paragraph text-[#5A5A5A]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
