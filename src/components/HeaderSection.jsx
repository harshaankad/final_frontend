"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Link from 'next/link';

export default function HeaderSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <header className="bg-gradient-to-br from-[#EAFFF0] via-[#E0F9E6] to-[#D5F3DC] relative w-full min-h-screen flex items-center overflow-hidden">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)',
          backgroundSize: '50px 50px',
          animation: 'moveGrid 20s linear infinite'
        }} />
      </div>

      {/* Enhanced Animated Background Elements for Mobile */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute top-10 left-6 w-20 h-20 bg-gradient-to-r from-green-200/40 to-emerald-200/30 rounded-full animate-pulse shadow-lg backdrop-blur-sm"></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-gradient-to-r from-emerald-300/50 to-teal-200/40 rounded-full animate-bounce [animation-delay:1s] shadow-md"></div>
        <div className="absolute bottom-40 left-10 w-12 h-12 bg-gradient-to-r from-green-400/30 to-lime-200/25 rounded-full animate-pulse [animation-delay:2s] shadow-sm"></div>
        <div className="absolute bottom-20 right-12 w-24 h-24 bg-gradient-to-r from-teal-200/25 to-cyan-200/20 rounded-full animate-bounce [animation-delay:0.5s] shadow-lg"></div>
        <div className="absolute top-20 right-4 w-2 h-16 bg-gradient-to-b from-green-400/60 to-transparent rotate-12 rounded-full shadow-sm animate-pulse"></div>
        <div className="absolute bottom-32 left-4 w-2 h-20 bg-gradient-to-t from-emerald-400/60 to-transparent -rotate-12 rounded-full shadow-sm animate-pulse [animation-delay:1.5s]"></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-green-300/40 rotate-45 animate-spin [animation-duration:8s] shadow-sm"></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-emerald-300/35 rotate-12 animate-ping [animation-delay:3s] rounded-sm"></div>
      </div>

      {/* Background Image with Transition */}
      <div 
  className={`absolute inset-0 hidden lg:block
  }`}
  style={{
    backgroundImage: "url('/home_doctor.png')",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 20px) center', // moved more to the right
    backgroundSize: '47%', // reduced size
    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
  }}
/>


      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-16 -mt-10 xl:px-[134px] pt-4 sm:pt-6 md:pt-8 lg:pt-12 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-[1000px] mx-auto lg:mx-0">
          <div className="mb-8 sm:mb-10 md:mb-12 relative">            
            <div className="relative">
 <h1
  className={`font-['Anek_Telugu-SemiBold',Helvetica] font-semibold text-[#1a1a1a] transition-colors duration-200 cursor-pointer text-3xl sm:text-4xl md:text-5xl lg:text-[60px] tracking-[0.13px] leading-tight sm:leading-[1.2] md:leading-[1.3] lg:leading-[79.4px] max-w-full lg:max-w-[654px] text-center lg:text-left transition-all duration-1000 ${
    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`}
>
  
  
    Welcome to Ankad Cutiscience
  
</h1>




  <p className={`text-gray-700 font-paragraph text-base sm:text-lg md:text-xl lg:text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-relaxed sm:leading-[1.6] md:leading-[1.7] lg:leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)] mt-4 sm:mt-5 md:mt-6 lg:mt-[19px] max-w-full lg:max-w-[471px] text-center lg:text-left transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} [transition-delay:300ms]`}>
    Trusted Dermoscopy reports and care, led by <strong className="text-green-700">Dr. B. S. Ankad</strong> with 20+ years of expertise.
  </p>
</div>

          </div>

          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 items-center lg:items-start justify-center lg:justify-start transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} [transition-delay:600ms]`}>
            <Link href="/login" className="w-full sm:w-auto group">
              <Button className="w-full sm:w-auto font-bold text-lg sm:text-xl h-[49px] sm:h-[49px] rounded-[7px] px-6 sm:px-5 py-2.5 font-button transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 min-w-[120px] bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group-hover:animate-pulse">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </Link>

            <Link href="/signup" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto px-6 sm:px-4 py-2.5 sm:py-2 bg-gradient-to-r from-[#EAFFF0] to-[#E0F9E6] text-[#242424] font-bold text-lg sm:text-xl border-2 border-black rounded-[7px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 hover:border-black hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 min-w-[120px] h-[49px] relative overflow-hidden group-hover:animate-pulse">
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-emerald-200/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </header>
  );
}
