/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "www.azuki.com",
      "img.freepik.com",
      "res.cloudinary.com", // ✅ Added Cloudinary domain
    ],
  },
};

export default nextConfig;

