/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/categoria/lazer",
        destination: "/lazer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
