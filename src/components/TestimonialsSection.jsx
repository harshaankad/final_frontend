"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      date: "12 July, 2024",
      rating: 5,
      text: "The detailed dermoscopy report I received was extremely clear and professional. It helped me understand my skin condition better and gave me confidence in my treatment.",
    },
    {
      id: 2,
      name: "Rahul Verma",
      date: "3 June, 2024",
      rating: 5,
      text: "I appreciated how quickly the report was generated and shared digitally. It made my follow-up consultation much smoother.",
    },
    {
      id: 3,
      name: "Ananya Patel",
      date: "18 May, 2024",
      rating: 4,
      text: "The clarity in the clinical impressions and side-by-side images in my report made everything easy to track. Highly recommended.",
    },
    {
      id: 4,
      name: "Vikram Iyer",
      date: "7 May, 2024",
      rating: 5,
      text: "Excellent service! The dermatologist explained the report thoroughly and the structured format was very professional.",
    },
    {
      id: 5,
      name: "Neha Gupta",
      date: "25 April, 2024",
      rating: 5,
      text: "Having digital access to all my reports in one place has been a lifesaver. No more carrying files around.",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Function to extract initials
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <h2 className="text-center font-h-2 mb-3 sm:mb-4 text-[#242424] font-bold text-2xl sm:text-3xl lg:text-4xl">
        What Our Client&apos;s Say
      </h2>

      <p className="text-center text-[#5A5A5A] max-w-xs sm:max-w-md lg:max-w-lg mb-8 sm:mb-10 text-sm sm:text-base">
        Hear from patients who have experienced the clarity, accuracy, and
        convenience of our dermatology reports and consultations.
      </p>

      <div className="relative w-full flex items-center py-6 sm:py-10 justify-center">
        {/* Left button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 sm:left-2 lg:left-0 rounded-full w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] bg-white lg:h-[70px] border-2 border-[#2e2e2e] z-10 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-out hover:bg-gray-50 active:scale-95"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#242424]" />
        </Button>

        {/* Testimonial Card */}
        <Card
          className={`w-full max-w-[280px] sm:max-w-[500px] lg:max-w-[770px] bg-white border-2 border-gray-300 overflow-hidden shadow-2xl rounded-[10px] transform transition-all duration-500 ease-in-out hover:shadow-3xl hover:-translate-y-1 ${
            isTransitioning
              ? "opacity-70 scale-95"
              : "opacity-100 scale-100"
          }`}
        >
          <CardContent className="p-4 sm:p-8 lg:p-16">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
              {/* Avatar Initials */}
              <Avatar className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[58px] lg:h-[58px] self-center sm:self-start">
                <AvatarFallback className="flex items-center justify-center w-full h-full text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-br from-green-100 to-teal-100 text-gray-700 rounded-full">
                  {getInitials(currentTestimonial.name)}
                </AvatarFallback>
              </Avatar>

              {/* Text Section */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-lg sm:text-xl text-[#242424] tracking-[0.40px]">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-sm sm:text-base opacity-80">
                      {currentTestimonial.date}
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center sm:justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                          i < currentTestimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="mt-4 sm:mt-6 text-[#5A5A5A] text-sm sm:text-base text-center sm:text-left leading-relaxed">
                  {currentTestimonial.text}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 sm:right-2 lg:right-0 rounded-full bg-white w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px] border-2 border-[#2e2e2e] z-10 hover:scale-105 hover:shadow-lg transform transition-all duration-300 ease-out hover:bg-gray-50 active:scale-95"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#242424]" />
        </Button>
      </div>
    </motion.section>
  );
}
