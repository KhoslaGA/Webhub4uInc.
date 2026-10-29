import { SERVICE_PAGES, servicePath } from "@/data/servicePages";
import { BUSINESS } from "@/lib/business";
import { LOCATIONS } from "@/data/locations";
import { getAllPosts } from "@/lib/blog";

export default function sitemap() {
  const base = BUSINESS.url;
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/ai-receptionist", priority: 0.9, changeFrequency: "weekly" },
    { path: "/missed-call-text-back", priority: 0.9, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guarantee", priority: 0.7, changeFrequency: "monthly" },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/roi", priority: 0.6, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.7, changeFrequency: "monthly" },
    { path: "/projects/insurimple", priority: 0.8, changeFrequency: "monthly" },
    { path: "/projects/rate-family", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blogs", priority: 0.7, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  ];
  const cityRoutes = LOCATIONS.map((c) => ({
    path: `/locations/${c.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));
  const postRoutes = getAllPosts().map((p) => ({
    path: `/blogs/${p.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
    ...(p.date ? { lastModified: new Date(p.date) } : {}),
  }));

  const serviceRoutes = SERVICE_PAGES.map((service) => ({ path: servicePath(service), priority: 0.8, changeFrequency: "monthly" }));

  return [...routes, ...serviceRoutes, ...cityRoutes, ...postRoutes].map((r) => ({
    url: `${base}${r.path}`,
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
