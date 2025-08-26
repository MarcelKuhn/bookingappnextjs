// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  // Images von Booking-CDNs zulassen (oder ganz abschalten via unoptimized)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '.bstatic.com' },
      { protocol: 'https', hostname: '.booking.com' },
    ],
  },

  // Seit Next 14/15 stabil: nicht mehr unter experimental
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes
  typedRoutes: true,

  // Globale Response-Header für alle Routen setzen
  // https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Erlaubt Einbettung durch deine WordPress-Domain(s)
          // https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://travelbucketlist.xyz https://www.travelbucketlist.xyz https://*.travelbucketlist.xyz;",
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;