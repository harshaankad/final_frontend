"use client"

import { CheckCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function WhyChooseUsSection() {
  const features = [
    {
      id: 1,
      title: "Expertise",
      description:
        "Our team of board-certified dermatologists brings years of clinical experience to ensure accurate analysis.",
    },
    {
      id: 2,
      title: "Personalized Care",
      description:
        "Each patient receives a customized treatment plan, tailored to their unique skin condition and medical history.",
    },
    {
      id: 3,
      title: "Advanced Facilities",
      description:
        "We use state-of-the-art diagnostic equipment and dermoscopy imaging to provide detailed and precise reports.",
    },
    {
      id: 4,
      title: "Trusted Relationships",
      description:
        "We prioritize patient trust and communication, ensuring transparency, clarity, and support throughout your journey.",
    },
  ];

  const [visibleElements, setVisibleElements] = useState({
    header: false,
    subtitle: false,
    image: false,
    features: {}
  });

  const headerRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);
  const featureRefs = useRef({});

  useEffect(() => {
    const observers = [];

    const createObserver = (element, key, isFeature = false, featureId = null) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (isFeature) {
              setVisibleElements(prev => ({
                ...prev,
                features: { ...prev.features, [featureId]: true }
              }));
            } else {
              setVisibleElements(prev => ({ ...prev, [key]: true }));
            }
            observer.unobserve(element);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      observer.observe(element);
      observers.push(observer);
    };

    createObserver(headerRef.current, 'header');
    createObserver(subtitleRef.current, 'subtitle');
    createObserver(imageRef.current, 'image');

    features.forEach(feature => {
      createObserver(featureRefs.current[feature.id], 'features', true, feature.id);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section className="w-full max-w-[1086px] mx-auto py-16 px-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-12 px-2">
        <h2 
          ref={headerRef}
          className={`font-h-2 text-4xl font-bold text-[#242424] text-center max-w-[890px] mb-4 transition-all duration-800 ease-out ${
            visibleElements.header 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          Why Choose Our Dermatology Services?
        </h2>

        <p 
          ref={subtitleRef}
          className={`font-paragraph text-[#5A5A5A] pt-4 text-center max-w-[471px] transition-all duration-800 ease-out delay-200 ${
            visibleElements.subtitle 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          We provide precise, professional, and patient-focused dermatology services backed by advanced technology.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2 pr-8">
          <img
            ref={imageRef}
            className={`w-full h-[485px] object-cover rounded-md transition-all duration-1000 ease-out ${
              visibleElements.image 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-12 scale-95'
            }`}
            alt="Dermatology clinic and staff"
            src="/clinic.jpg"
          />
        </div>

        {/* Features */}
        <div className="w-full md:w-1/2 space-y-12">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              ref={el => featureRefs.current[feature.id] = el}
              className={`relative pl-6 transition-all duration-700 ease-out ${
                visibleElements.features[feature.id] 
                  ? 'opacity-100 translate-y-0 translate-x-0' 
                  : 'opacity-0 translate-y-6 translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 150 + 400}ms` }}
            >
              {/* Vertical line */}
              <div 
                className={`absolute left-0 top-0 w-0.5 bg-[#242424] transition-all duration-1000 ease-out ${
                  visibleElements.features[feature.id] 
                    ? 'h-full opacity-100' 
                    : 'h-0 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150 + 600}ms` }}
              ></div>

              <div className="mb-2 flex items-center">
                <h3 
                  className={`font-bold text-brandGreen text-2xl tracking-[0.40px] transition-all duration-500 ease-out ${
                    visibleElements.features[feature.id] 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-2'
                  }`}
                  style={{ transitionDelay: `${index * 150 + 500}ms` }}
                >
                  {feature.title}
                </h3>
                <CheckCircle 
                  className={`w-[17px] h-[17px] ml-2 text-brandGreen transition-all duration-500 ease-out ${
                    visibleElements.features[feature.id] 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-0 rotate-45'
                  }`}
                  style={{ transitionDelay: `${index * 150 + 700}ms` }}
                />
              </div>

              <p 
                className={`font-paragraph text-[#5A5A5A] transition-all duration-600 ease-out ${
                  visibleElements.features[feature.id] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${index * 150 + 800}ms` }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
