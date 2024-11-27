/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const runtimeCaching = [
  {
    urlPattern: /^https?.*/, // Cache all network requests
    handler: "NetworkFirst", // Try network first, fallback to cache
    options: {
      cacheName: "http-cache",
      expiration: {
        maxEntries: 100, // Limit cache size
        maxAgeSeconds: 24 * 60 * 60, // Cache for 24 hours
      },
    },
  },
  {
    urlPattern:
      /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|eot|ttf|otf|css|js)$/,
    handler: "CacheFirst", // Use cached version first
    options: {
      cacheName: "static-assets",
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      },
    },
  },
];

const pwaConfig = withPWA({
  dest: "public",
  runtimeCaching,
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  ...pwaConfig,
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/games",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
