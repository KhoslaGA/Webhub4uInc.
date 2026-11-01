/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return process.env.VERCEL_ENV === "preview" ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : [];
  },
  async redirects() {
    return [
      { source: "/services/web-design", destination: "/services/web-development", permanent: true },
      { source: "/services/local-seo", destination: "/services/seo", permanent: true },
    ];
  },
};

export default nextConfig;
