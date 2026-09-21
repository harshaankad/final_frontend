"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Example from "@/components/navbar";
import Stepper from "@/components/Stepper";
import { useForm } from '../../context/context';
import { RAZORPAY_KEY_ID } from "@/lib/config";
import { apiFetch, isLoggedIn } from "@/lib/auth";

export default function Step4() {
  const router = useRouter();
  const { patientId, firstName, lastName } = useForm();

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

    if (!isLoggedIn()) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // The fee is fixed server-side; only the patient is sent.
      const orderResponse = await apiFetch("/create-payment", { method: "POST", body: { patientId } });

      if (orderResponse.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DermaDrishti',
        description: 'Patient Consultation Fee',
        order_id: orderData.orderId,
        prefill: { name, email },
        theme: { color: '#285430' },
        handler: async (response) => {
          try {
            const verifyResponse = await apiFetch("/verify-payment", {
              method: "POST",
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
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

      <Stepper current={4} />

      {/* FORM */}
      <form onSubmit={submitForm} className="flex flex-col w-full max-w-xl mx-auto mt-4 sm:mt-6 text-black px-4 sm:px-6 pb-10 gap-5 sm:gap-6">
        <h1 className="text-left text-xl sm:text-2xl lg:text-3xl font-medium text-black my-4 sm:my-8">Payment</h1>

        <div className="surface p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">Pay Consultation Fee</h2>

          {error && (
            <div className="alert-error mb-5" role="alert">
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="payer-name" className="field-label">Name</label>
              <input
                id="payer-name"
                type="text"
                name="name"
                placeholder="Full name"
                value={payData.name}
                onChange={handlePayChange}
                required
                className="field-input"
                disabled={isProcessing}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="payer-email" className="field-label">Email</label>
              <input
                id="payer-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={payData.email}
                onChange={handlePayChange}
                required
                className="field-input"
                disabled={isProcessing}
                autoComplete="email"
              />
            </div>
          </div>

          <button type="submit" disabled={isProcessing} className="btn-primary w-full mt-6">
            {isProcessing && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isProcessing ? 'Processing...' : 'Pay ₹299'}
          </button>
        </div>

        {/* Back button */}
        <div className="flex justify-start">
          <Link href="/step3">
            <button type="button" className="btn-secondary min-w-[140px]">
              Back
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
