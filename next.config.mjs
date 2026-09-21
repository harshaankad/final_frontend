/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "https://api.ankad.in").replace(/\/$/, "");

// Content-Security-Policy. Every external host the app talks to is listed
// here; anything else is blocked by the browser, which limits what an XSS
// could load or exfiltrate to. 'unsafe-inline' for scripts is required by
// Next.js's hydration scripts on statically rendered pages (a nonce-based
// policy would force every page to render dynamically); 'unsafe-inline' for
// styles is needed by framer-motion. Razorpay's checkout is an iframe from
// *.razorpay.com that also calls their APIs and analytics.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://checkout.razorpay.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://res.cloudinary.com https://api.cloudinary.com https://img.freepik.com https://www.azuki.com https://*.razorpay.com",
  `connect-src 'self' ${API_ORIGIN} https://api.cloudinary.com https://res.cloudinary.com https://*.razorpay.com${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  "frame-src https://*.razorpay.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Patient page URLs (which contain patient ids) must never be sent as a
  // Referer to Cloudinary, Razorpay or anyone else.
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  images: {
    domains: [
      "localhost",
      "www.azuki.com",
      "img.freepik.com",
      "res.cloudinary.com", // legacy public patient photos (until migrated) + marketing
      "api.cloudinary.com", // signed, expiring patient photo URLs
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
