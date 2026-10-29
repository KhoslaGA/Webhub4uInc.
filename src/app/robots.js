import { BUSINESS } from "@/lib/business";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BUSINESS.url}/sitemap.xml`,
  };
}
