import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // This is required to allow the Firebase Studio preview environment to access the Next.js dev server.
    allowedDevOrigins: [
      "9000-firebase-studio-1752465458198.cluster-2xid2zxbenc4ixa74rpk7q7fyk.cloudworkstations.dev",
    ]
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
