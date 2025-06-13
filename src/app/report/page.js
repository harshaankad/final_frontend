'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Example from "@/components/navbar";

export default function Report() {
  const router = useRouter()

  return (
    <div className="bg-white w-full font-poppins min-h-screen flex flex-col items-center font-sans">

     <div className="w-full">
             <Example />
           </div>

      <div className="flex flex-row justify-start items-center w-full space-x-0 sm:space-x-10 py-6 pl-10 shadow-md">
              <Link href="/"><span className="ml-2 text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-105 transition-transform duration-200 ease-in-out sm:ml-40">Patients</span></Link>
              {/* DOT */}
              <span className="text-gray-400 text-lg sm:text-xl px-2">•</span>
              <Link href="/"><span className="text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-125 duration-100 transition-transform ease-in-out">Report</span></Link>
            </div>

      {/* REPORT BODY */}
      <div className="w-full max-w-5xl border border-black my-10 p-6 space-y-6 text-gray-800">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-lg font-poppins font-bold">Name Of Hospital (Dermoscopy Analysis)</h2>
          <h3 className="font-semibold font-poppins">Dr ABCD XYZ</h3>
          <p className="font-mediumfont-poppins">Bengaluru</p>
        </div>

        {/* Patient Info */}
        <div className="grid font-poppins grid-cols-1 sm:grid-cols-3 gap-4 border border-black px-4 py-3 text-sm font-medium">
          <p><strong>Name :</strong> Aditya Kumar</p>
          <p><strong>Age / Sex :</strong> Male / 26</p>
          <p><strong>Date :</strong> 21/04/2025</p>
        </div>

        {/* Clinical Details */}
        <div className="px-4 text-sm space-y-2 font-poppins">
          <p><strong>Site of legion :</strong> Left forearm</p>
          <p><strong>Duration of Symptoms :</strong> 10 days</p>
          <p><strong>Clinical Impression :</strong> Something Something happening , Nobody knows what and why</p>
        </div>

        {/* Findings + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 text-sm">
          <div className="border border-black p-4 space-y-2 font-poppins">
            <p className="font-semibold text-xl font-poppins mb-8">Dermosopic findings:</p>
            <p><strong>Purple :</strong> Blue areas</p>
            <p><strong>Green :</strong> Pigmented areas</p>
            <p><strong>Blue :</strong> Dotted vessels</p>
            <p><strong>Red :</strong> Scale</p>

            <p><strong>Impression :</strong> Dermoscopic features suggestive of Bowens disease</p>
            <p><strong>Advice :</strong> Histopathological examination to confirm diagnosis</p>
          </div>

          <div className="font-poppins w-full h-auto space-y-4">
            <div className="border border-black">
            <div className="flex justify-center">
              <Image
                src="/skin.jpg"
                alt="Dermoscopy 1"
                width={200}
                height={200}
                className="object-cover"
              />
              </div>
            </div>
            <div className="border border-black">
            <div className="flex justify-center">
              <Image
                src="/skin.jpg"
                alt="Dermoscopy 2"
                width={200}
                height={200}
                className="object-cover"
              />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
