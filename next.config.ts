import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    forceSwcTransforms: process.env.NODE_ENV !== 'test',
  },
};

export default nextConfig;
