/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/seats",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
