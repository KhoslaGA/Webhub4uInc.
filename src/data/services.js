/**
 * Canonical service definitions — the single source for the services grid on
 * city pages, the /locations hub, and (later) /services/[service] pages.
 * Keyword targets per D3 §4.3.
 */
export const SERVICES = [
  {
    slug: "ai-receptionist",
    name: "AI Receptionist",
    href: "/ai-receptionist",
    tag: "AI",
    short:
      "Answers every call, texts back missed ones, and books jobs into your calendar — 24/7.",
    priceFrom: "$397/mo",
    painPoints: [
      "Calls hitting voicemail while you're on the job",
      "After-hours leads going to the competitor who picks up",
      "No time to answer and do the work",
    ],
    deliverables: [
      "AI that answers in your business name",
      "Instant text-back on missed calls",
      "Appointment booking + calendar sync",
      "Call transcripts and recordings",
    ],
  },
  {
    slug: "missed-call-text-back",
    name: "Missed Call Text-Back",
    href: "/missed-call-text-back",
    tag: "AI",
    short:
      "Every missed call gets an instant, friendly text so the lead never goes cold.",
    priceFrom: "$197/mo",
    painPoints: [
      "Missed calls that never call back",
      "Leads choosing whoever replies first",
    ],
    deliverables: [
      "Automatic text-back on your existing number",
      "Custom message written with you",
      "A conversation that keeps the lead warm",
    ],
  },
  {
    slug: "web-design",
    name: "Web Design & Development",
    href: "/services/web-development",
    tag: "Web",
    short:
      "Fast, modern, mobile-first websites built to turn visitors into calls and bookings.",
    priceFrom: "$997",
    painPoints: [
      "A dated site that makes a good business look small",
      "Slow, template sites that don't rank or convert",
    ],
    deliverables: [
      "Custom design on a fast modern stack",
      "Built for search and conversion",
      "You own the code and the domain",
    ],
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    href: "/services/seo",
    tag: "Growth",
    short:
      "Get found in the map pack and local search with a plan that actually moves rankings.",
    priceFrom: "$449/mo",
    painPoints: [
      "Invisible on Google Maps for your own services",
      "Competitors outranking you locally",
    ],
    deliverables: [
      "City landing pages + on-page SEO",
      "Reviews strategy that compounds",
      "Local citations and rank tracking",
    ],
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile",
    href: "/services/seo",
    tag: "Growth",
    short:
      "A fully optimized, actively managed Google profile — the #1 local ranking lever.",
    priceFrom: "$449/mo",
    painPoints: [
      "An unclaimed or half-built Google profile",
      "No reviews coming in, no posts, no traffic",
    ],
    deliverables: [
      "Full profile build + category tuning",
      "Weekly posts and Q&A seeding",
      "Automated review requests",
    ],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
