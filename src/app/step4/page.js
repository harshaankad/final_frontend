"use client"
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import Example from "@/components/navbar";
import { useForm } from '../../context/context';

export default function Step4() {
  const router = useRouter();
  
  // Get patient data from context
  const { patientId, doctorId } = useForm(); // You'll need to add these to your context

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const [payData, setPayData] = useState({
    name: '',
    email: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Function to get token from localStorage safely
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
    
    const { name, email } = payData;
    if (!name || !email) {
      return alert('Please fill in name & email');
    }

    if (!window.Razorpay) {
      return alert('Failed to load Razorpay. Please try again.');
    }

    const token = getAuthToken();
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment order on backend
      console.log("Creating payment with:");
      console.log("doctorId:", doctorId);
      console.log("patientId:", patientId);

      const orderResponse = await fetch(`http://localhost:5000/api/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctorId, // You'll need to get this from context or props
          patientId: patientId, // You'll need to get this from context after patient creation
          amount: 49, // ₹49
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

      // Step 2: Open Razorpay checkout
      const options = {
        key: 'rzp_test_uuVFt7gYPAllw8', // Replace with your Key ID
        amount: orderData.amount, // Amount in paise from backend
        currency: orderData.currency,
        name: 'Derma Website',
        description: 'Patient Consultation Fee',
        order_id: orderData.orderId,
        prefill: { name, email },
        theme: { color: '#285430' },
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch(`http://localhost:5000/api/verify-payment`, {
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
                amount: orderData.amount / 100, // Convert back to rupees
              }),
              credentials: "include",
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert("Payment successful! Patient created successfully.");
              router.push('/'); // Redirect to patients list or success page
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: { 
          ondismiss: () => {
            console.log('Checkout closed');
            setIsProcessing(false);
          }
        }
      };

      new window.Razorpay(options).open();
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col justify-start items-center">
      {/* GREEN NAVIGATION BAR */}
      <div className="w-full">
        <Example />
      </div>

      <div className="flex flex-row justify-start items-center w-full space-x-0 sm:space-x-10 py-6 pl-10 shadow-md">
        <Link href="/">
          <span className="ml-2 text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-105 transition-transform duration-200 ease-in-out sm:ml-40">Patients</span>
        </Link>
        <span className="text-gray-400 text-lg sm:text-xl px-2">•</span>
        <Link href="/">
          <span className="text-sm font-medium text-gray-400 p-2 sm:p-6 hover:text-green-800 hover:scale-125 duration-100 transition-transform ease-in-out">Add New Patient</span>
        </Link>
      </div>

      <div className="flex flex-row items-center mt-14 space-x-4">
        <div className="hidden sm:block text-gray-400 font-semibold text-2xl pr-20">1 <span className="text-base">Basic Information</span></div>
        <div className="hidden sm:block text-gray-400 font-semibold text-2xl pr-20">2 <span className="text-base">Upload Photos</span></div>
        <div className="hidden sm:block text-gray-400 font-semibold text-2xl pr-20">3 <span className="text-base">Choose Region</span></div>
        <div className="text-[#5F8D4E] border-b-4 border-[#5F8D4E] font-semibold text-2xl pr-20">4 <span className="text-base">Payment</span></div>
      </div>

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-xl mx-auto mt-6 text-black p-4 gap-2">
        <span className="text-left sm:text-2xl text-3xl font-medium font-poppins text-black my-8">Payment gateway</span>

        {/* Pay Fee Form */}
        <div className="w-full max-w-2xl border border-gray-600 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-6">Pay Fee</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={payData.name}
                onChange={handlePayChange}
                required
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={payData.email}
                onChange={handlePayChange}
                required
                className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                disabled={isProcessing}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`mt-4 w-full bg-[#5F8D4E] text-[#ffffff] text-sm font-medium py-2.5 rounded hover:scale-105 hover:shadow-xl transition-transform duration-200 ease-in-out uppercase ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pay ₹49'}
          </button>
        </div>
      </form>
    </div>
  );
}