"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export default function CallToActionSection() {
  const formFields = [
    { id: "name", placeholder: "Your Name" },
    { id: "phone", placeholder: "Your Phone Number" },
    { id: "date", placeholder: "Date" },
  ];

  return (
    <section className="w-full py-12 px-4">
      <Card className="w-full max-w-[1170px] mx-auto bg-[#181C32] rounded-[30px] p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-8 p-12 justify-between">
          {/* Left side content */}
          <div className="flex flex-col space-y-6 max-w-[611px]">
            <div className="space-y-2">
              <p className="text-[#FFFFFF] text-base tracking-[0.32px]">
                Need a doctor's counseling?
              </p>
              <h2 className="text-[#FFFFFF] text-5xl font-semibold tracking-[0.96px] leading-[54px]">
                Request a Call Back
                <br />
                Today Now
              </h2>
            </div>

            <p className="text-[#FFFFFF]">
              Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh
              quis ullamcorper quis. Quam enim tortor, id sed
            </p>

            <div className="flex items-center gap-2 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((_, index) => (
                  <Avatar
                    key={index}
                    className="w-[58px] h-[58px] border-2 border-[#181c32]"
                  >
                    <img
                      src="/home_doctor.png"
                      alt="Doctor"
                      className="object-cover"
                    />
                  </Avatar>
                ))}
              </div>
              <p className="text-[#FFFFFF] ml-4">
                Our Doctors are waiting
                <br />
                for your service.
              </p>
            </div>
          </div>

          {/* Right side form */}
          <div className="flex flex-col space-y-8 max-w-[421px] w-full">
            {formFields.map((field) => (
              <Input
                key={field.id}
                id={field.id}
                placeholder={field.placeholder}
                className="h-[58px] bg-[#FFFFFF] rounded-[5px] px-6"
              />
            ))}

            <Button className="h-[49px] w-[220px] bg-[#5f8d4e] transform transition-transform hover:scale-105 hover:shadow-lg text-[#FFFFFF] font-bold rounded-[5px] text-xl">
              Request Now
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
