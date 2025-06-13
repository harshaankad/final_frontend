import { Button } from "@/components/ui/button";
import React from "react";
import Link from 'next/link';


export default function HeaderSection() {
  return (
    <header
      className="bg-[#EAFFF0] relative w-full bg-cover bg-center h-[751px]"
      style={{
        backgroundImage: "url('/home_doctor.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'calc(100% - 60px) center',
        backgroundSize: 'contain',  
      }}
    >
      <div className=" relative pt-[139px] pl-[134px] max-w-[1000px]">
        <div className="mb-10">
          <h1 className="font-['Anek_Telugu-SemiBold',Helvetica] font-semibold text-[#242424] text-[60px] tracking-[0.13px] leading-[79.4px] max-w-[654px]">
            Welcome To Ankad Cutiscience
          </h1>

          <p className="text-[#242424] font-paragraph font-[number:var(--paragraph-font-weight)] text-[length:var(--paragraph-font-size)] tracking-[var(--paragraph-letter-spacing)] leading-[var(--paragraph-line-height)] [font-style:var(--paragraph-font-style)] mt-[19px] max-w-[471px]">
            The only place you will ever need to visit to get solutions to all your skin related problems
          </p>
        </div>

        <div className="flex gap-6 mt-[28px]">

          <Link href="/login">
          <Button className="font-bold text-xl h-[49px] rounded-[7px] px-5 py-2.5 font-button transform transition-transform hover:scale-105 hover:shadow-lg">
            Login
          </Button>
          </Link>

          <Link href="/signup">
          <button
            className={`px-4 py-2 bg-[#EAFFF0] text-[#242424] font-bold text-xl border-2 border-black rounded-[7px] transform transition-transform hover:scale-105 hover:shadow-lg`}
          > SignUp
          </button>
          </Link>

        </div>
      </div>
    </header>
  );
}
