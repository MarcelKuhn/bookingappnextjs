// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.bstatic.com' },
      { protocol: 'https', hostname: '**.booking.com' },
    ],
  },
  typedRoutes: true,
};

module.exports = nextConfig;