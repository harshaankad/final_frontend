"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import React from "react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Floyd Miles",
      date: "24 May, 2020",
      rating: 5,
      text: "Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor. Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor. Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis ullamcorper quis. Quam enim tortor.",
      avatar: "", // Add avatar URL if any
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="flex flex-col items-center justify-center py-12 px-4 max-w-5xl mx-auto">
      <h2 className="text-center font-h-2 mb-4 text-[#242424] font-bold text-3xl">
        What Our Client&apos;s Say
      </h2>

      <p className="text-center text-[#5A5A5A] font-paragraph max-w-md mb-10">
        Eu sit proin amet quis malesuada vitae elit. Vel consectetur nibh quis
        ullamcorper quis. Quam enim tortor, id sed
      </p>

      <div className="relative w-full flex items-center py-10 justify-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 rounded-full w-[70px] bg-white h-[70px] border-2 border-gray-500 border-[#2e2e2e] z-10 hover:scale-105 hover:shadow-lg"
          onClick={handlePrevious}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-6 text-[#242424] w-6 text-size-xl" />
        </Button>

        <Card className="w-full max-w-[770px] bg-white border-2 border-gray-300 overflow-hidden shadow-2xl rounded-[10px]">
          <CardContent className="p-16">
            <div className="flex items-start gap-5">
            <Avatar className="w-[58px] h-[58px]">
  <AvatarFallback>{currentTestimonial.name.charAt(0)}</AvatarFallback>
</Avatar>




              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-xl text-secendery tracking-[0.40px] font-['Anek_Telugu-SemiBold',Helvetica]">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-text font-paragraph">{currentTestimonial.date}</p>
                  </div>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < currentTestimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-[#5A5A5A] font-paragraph">{currentTestimonial.text}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 rounded-full bg-white w-[70px] h-[70px] border-[#2e2e2e] z-10 border-2 border-gray-500 border-[#2e2e2e] z-10 hover:scale-105 hover:shadow-lg"
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 text-[#242424] w-6" />
        </Button>
      </div>
    </section>
  );
}
