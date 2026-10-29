/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      { source: "/services/web-design", destination: "/services/web-development", permanent: true },
      { source: "/services/local-seo", destination: "/services/seo", permanent: true },
    ];
  },
};

export default nextConfig;
