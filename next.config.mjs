/** @type {import('next').NextConfig} */

// Baseline security headers. A Content-Security-Policy is deliberately not
// set yet: it has to be tested against Razorpay checkout, Google Fonts and
// Cloudinary before it can be turned on without breaking the app.
const securityHeaders = [
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
