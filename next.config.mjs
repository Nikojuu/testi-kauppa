/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.shipit.fi",
        port: "",
      },
      {
        protocol: "https",
        hostname: "resources.paytrail.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
