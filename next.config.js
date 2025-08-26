/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.bstatic.com' }, // Booking CDN
      { protocol: 'https', hostname: '**.booking.com' }
    ]
  },
  experimental: { typedRoutes: true }
};

module.exports = nextConfig;