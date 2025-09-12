import React from "react";
import CallToActionSection from "@/components/CallToActionSection";
import FooterSection from "@/components/FooterSection";
import HeaderSection from "@/components/HeaderSection";
import NavBar from "@/components/navbar";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

export default function HomePage() {
  return (
    <div className="bg-gray-100 flex flex-col items-center w-full">
      <div className="bg-gray-100 w-full relative">
        <NavBar />
        <main>
          <HeaderSection  />
          <ServicesSection />
          <TestimonialsSection />
          <WhyChooseUsSection />
          <CallToActionSection />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}
