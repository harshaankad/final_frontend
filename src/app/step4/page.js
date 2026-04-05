"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Example from "@/components/navbar";
import { useForm } from '../../context/context';

export default function Step4() {
  const router = useRouter();
  const { patientId, doctorId, firstName, lastName } = useForm();

  const [payData, setPayData] = useState({
    name: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Pre-fill name from context
  useEffect(() => {
    if (firstName || lastName) {
      setPayData(prev => ({
        ...prev,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
      }));
    }
  }, [firstName, lastName]);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  };

  const handlePayChange = (e) => {
    setPayData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email } = payData;
    if (!name || !email) {
      setError("Please fill in name & email.");
      return;
    }

    if (!window.Razorpay) {
      setError("Failed to load Razorpay. Please refresh the page.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      const orderResponse = await fetch(`https://dermatology-backend-8xqf.onrender.com/api/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          patientId: patientId,
          amount: 10, // ₹10 — change to 299 once everything is confirmed working
        }),
        credentials: "include",
      });

      if (orderResponse.status === 401) {
        localStorage.removeItem("authToken");
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order");
      }

      const options = {
        key: 'rzp_live_SUL8Trxygv1AJ0',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DermDrishti',
        description: 'Patient Consultation Fee',
        order_id: orderData.orderId,
        prefill: { name, email },
        theme: { color: '#285430' },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`https://dermatology-backend-8xqf.onrender.com/api/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                patientId: orderData.patientId,
                amount: orderData.amount / 100,
              }),
              credentials: "include",
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              router.push('/patients');
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      <div className="w-full">
        <Example />
      </div>

      {/* PROGRESS STEPS */}
      <div className="flex flex-row items-center justify-center mt-8 sm:mt-14 space-x-4">
        <div className="hidden lg:flex flex-row items-center space-x-4">
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            1 <span className="text-base">Basic Information</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            2 <span className="text-base">Upload Photos</span>
          </div>
          <div className="text-gray-400 font-semibold text-2xl pr-20">
            3 <span className="text-base">Choose Region</span>
          </div>
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">
            4 <span className="text-base">Payment</span>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl">
            4 <span className="text-base">Payment</span>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-xl mx-auto mt-4 sm:mt-6 text-black p-4 gap-2">
        <span className="text-left text-xl sm:text-2xl lg:text-3xl font-medium font-poppins text-black my-4 sm:my-8">Payment</span>

        <div className="w-full border border-gray-300 rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-6 font-poppins">Pay Consultation Fee</h2>

          {error && (
            <div className="text-red-500 text-sm font-poppins mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-poppins font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={payData.name}
                onChange={handlePayChange}
                required
                className="w-full border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base font-poppins focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-poppins font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={payData.email}
                onChange={handlePayChange}
                required
                className="w-full border border-gray-400 rounded h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base font-poppins focus:outline-none focus:ring-2 focus:ring-[#5F8D4E] focus:border-transparent transition-all duration-200"
                disabled={isProcessing}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`mt-6 w-full font-bold text-base sm:text-lg h-[45px] sm:h-[49px] rounded-[7px] font-poppins transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 bg-gradient-to-r from-[#5F8D4E] to-[#4a7a3a] hover:from-[#4a7a3a] hover:to-[#3d6330] relative overflow-hidden group text-[#ffffff] ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isProcessing && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isProcessing ? 'Processing...' : 'Pay ₹1'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>

        {/* Back button */}
        <div className="flex justify-start mt-4">
          <Link href="/step3">
            <button
              type="button"
              className="font-bold text-base sm:text-lg h-[45px] sm:h-[49px] rounded-[7px] px-4 sm:px-6 py-2.5 font-poppins border-2 border-[#5F8D4E] text-[#5F8D4E] hover:bg-[#5F8D4E] hover:text-white transition-all duration-300 min-w-[120px]"
            >
              Back
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
