import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
