/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/, /app-build-manifest\.json$/],
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/seating\.fcn\.de\/_next\/data\/.+\.json$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-data",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 86400,
        },
      },
    },
    {
      urlPattern: /\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 86400,
        },
      },
    },
  ],
});

module.exports = withPWA({
  trailingSlash: true,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/games",
        permanent: true,
      },
    ];
  },
});
