"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CallToActionSection() {
  const formFields = [
    { id: "name", placeholder: "Your Name" },
    { id: "phone", placeholder: "Your Phone Number" },
    { id: "date", placeholder: "Date" },
  ];

  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Card className="w-full max-w-[1170px] mx-auto bg-[#181C32] rounded-[15px] sm:rounded-[20px] lg:rounded-[30px] p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-12 justify-between">
            {/* Left side content */}
            <div className="flex flex-col space-y-4 sm:space-y-6 max-w-full lg:max-w-[611px]">
              <div className="space-y-2 text-center lg:text-left">
                <p className="text-[#FFFFFF] text-sm sm:text-base tracking-[0.32px] opacity-90">
                  Need a dermatology advice?
                </p>
                <h2 className="text-[#FFFFFF] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[0.96px] leading-tight sm:leading-[1.2] lg:leading-[54px]">
                  Request a Call Back
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Today Now
                </h2>
              </div>

              <p className="text-[#FFFFFF] text-sm sm:text-base opacity-80 text-center lg:text-left leading-relaxed">
                Schedule a callback with our dermatologists and get professional guidance on your skin concerns and reports.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-2 pt-4 sm:pt-8">
                <div className="flex -space-x-2 sm:-space-x-4">
                  {[1, 2, 3].map((_, index) => (
                    <Avatar
                      key={index}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[58px] lg:h-[58px] border-2 border-[#181c32] transition-transform duration-300 ease-in-out hover:scale-110 hover:z-10"
                    >
                      <img
                        src="/patient.png"
                        alt="Doctor"
                        className="object-cover"
                      />
                    </Avatar>
                  ))}
                </div>
                <p className="text-[#FFFFFF] text-sm sm:text-base ml-0 sm:ml-4 text-center lg:text-left opacity-90">
                  Our Doctors are waiting
                  <br />
                  for your service.
                </p>
              </div>
            </div>

            {/* Right side form */}
            <div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 max-w-full sm:max-w-[421px] w-full">
              {formFields.map((field, index) => (
                <Input
                  key={field.id}
                  id={field.id}
                  placeholder={field.placeholder}
                  className="h-12 sm:h-14 lg:h-[58px] bg-[#FFFFFF] rounded-[5px] px-4 sm:px-6 text-sm sm:text-base transition-all duration-300 ease-in-out hover:shadow-lg focus:shadow-xl focus:scale-[1.02] border-0 focus:ring-2 focus:ring-[#5f8d4e] focus:ring-opacity-50"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              ))}

<Button className="h-12 sm:h-[49px] w-full sm:w-[220px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] text-[#FFFFFF] font-bold rounded-[5px] text-lg sm:text-xl mx-auto lg:mx-0 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 active:scale-95 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#5f8d4e] focus:ring-opacity-30 relative overflow-hidden group group-hover:animate-pulse px-6 sm:px-5">
  <span className="relative z-10 transition-all duration-300 ease-in-out group-hover:tracking-wider">
    Request Now
  </span>
  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
</Button>

            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
