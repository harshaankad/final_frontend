import React from "react";
import HeaderSection from "@/components/HeaderSection";
import NavBar from "@/components/navbar";

export default function HomePage() {
  return (
    <div className="bg-gray-100 flex flex-col items-center w-full">
      <div className="bg-gray-100 w-full relative">
        <NavBar />
        <main>
          <HeaderSection />
        </main>
      </div>
    </div>
  );
}
