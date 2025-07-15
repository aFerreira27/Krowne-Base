import type {NextConfig} from 'next';
require('dotenv').config({ path: './.env' });


const nextConfig: NextConfig = {
  experimental: {
    // Options for the experimental features in Next.js.
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
