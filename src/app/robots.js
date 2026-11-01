import { BUSINESS } from "@/lib/business";

export default function robots() {
  if (process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BUSINESS.url}/sitemap.xml`,
  };
}
