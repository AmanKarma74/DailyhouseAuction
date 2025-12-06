// next.config.mjs
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // ⚡ Optimize Cloudinary + Google OAuth images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Auth profile images
        pathname: "/**",
      },
    ],
  },

  // ⚙️ Enable faster builds and bundling
  experimental: {
    optimizePackageImports: ["lucide-react", "zustand"],
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  // 🔒 Security headers (Recommended for production)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
