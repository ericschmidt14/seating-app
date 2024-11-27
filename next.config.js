/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching,
});

module.exports = withPWA({
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
});
