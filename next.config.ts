import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Forced restart trigger for env vars text-config
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
  transpilePackages: ['mapbox-gl'],
};

export default nextConfig;
