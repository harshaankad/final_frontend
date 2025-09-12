"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Hospital,
  Pill,
  Shield,
  Thermometer,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ServicesSection() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  const services = [
    {
      title: "Clinical Examination",
      description:
        "Comprehensive dermatological check-ups with detailed documentation and professional assessment of your skin condition.",
      icon: <Users className="w-12 h-12 sm:w-16 sm:h-16 text-[#5F8D4E]" />,
    },
    {
      title: "Dermoscopic Imaging",
      description:
        "High-resolution dermoscopy imaging as well as clinical imaging that aids in the early and accurate detection of skin disorders.",
      icon: <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-[#5F8D4E]" />,
    },
    {
      title: "Histopathology Reports",
      description:
        "Precise laboratory-based histopathology reports that provide deeper insights into complex skin conditions.",
      icon: <Hospital className="w-12 h-12 sm:w-16 sm:h-16 text-[#5F8D4E]" />,
    },
    {
      title: "Digital Record Management",
      description:
        "Secure storage and easy access to your medical images and reports through our digital record system.",
      icon: <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-[#5F8D4E]" />,
    },
    {
      title: "Treatment Monitoring",
      description:
        "Ongoing monitoring of your treatment progress with comparative reports to ensure effectiveness and improvement.",
      icon: <Thermometer className="w-12 h-12 sm:w-16 sm:h-16 text-[#5F8D4E]" />,
    },
    {
      title: "Expert Consultations",
      description:
        "Consult with experienced dermatologists for second opinions and guided care based on your reports.",
      icon: <Pill className="w-12 h-12 sm:w-16 sm:h-16 text-[#5F8D4E]" />,
    },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setVisibleCards((prev) => new Set([...prev, index]));
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#242424] mb-4 sm:mb-6 leading-tight">
          Our Services
        </h2>
        <p className="text-[#242424] max-w-sm sm:max-w-lg lg:max-w-xl mx-auto font-paragraph text-base sm:text-lg leading-relaxed px-4">
          Specialized dermatology services with precise imaging, expert
          consultations, and accurate reports to guide your treatment journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            data-index={index}
            className={`transform transition-all duration-700 ease-out ${
              visibleCards.has(index)
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-95"
            }`}
            style={{
              transitionDelay: `${index * 150}ms`,
            }}
          >
            <Card className="rounded-xl sm:rounded-[16px] border-2 border-gray-200 hover:border-[#5F8D4E] overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out group h-full bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0 h-full">
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex justify-start mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                    <div className="p-3 sm:p-4 rounded-2xl bg-[#5F8D4E]/10 group-hover:bg-[#5F8D4E]/20 transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl text-[#242424] tracking-wide mb-3 sm:mb-4 font-['Anek_Telugu-SemiBold',Helvetica] group-hover:text-[#5F8D4E] transition-colors duration-300 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-[#5A5A5A] font-paragraph text-sm sm:text-base leading-relaxed group-hover:text-[#404040] transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <div className="w-0 h-1 bg-gradient-to-r from-[#5F8D4E] to-[#4A7A3D] rounded-full group-hover:w-full transition-all duration-500 ease-out"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
