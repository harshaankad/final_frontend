/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "www.azuki.com", "img.freepik.com"], // ✅ Allow external images from GitHub
      },
};

export default nextConfig;
