import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Optimize images
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
  },

  // Reduce bundle size
  experimental: {
    optimizeCss: true,
  },

  // Handle static file serving better
  async rewrites() {
    return [
      {
        source: '/.well-known/:path*',
        destination: '/404',
      },
    ];
  },

  // Suppress common dev warnings
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
