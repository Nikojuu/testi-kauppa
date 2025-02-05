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
      {
        protocol: "https",
        hostname: "dsh3gv4ve2.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
