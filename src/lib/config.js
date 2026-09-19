// Runtime configuration for the frontend.
//
// Defaults are the PRODUCTION values so a plain build/deploy needs no env setup.
// For local development create `.env.local` (gitignored) with:
//   NEXT_PUBLIC_API_URL=http://localhost:5000
//   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
// The Razorpay key must match the mode (test/live) of the backend's keys.

export const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "https://dermatology-backend-8xqf.onrender.com").replace(/\/$/, "");
export const API_BASE = `${API_ORIGIN}/api`;
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SUL8Trxygv1AJ0";
