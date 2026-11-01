import LandingPage from "@/components/sections/new/LandingPage";

export const metadata = {
  title: "AI Receptionist for GTA Businesses | Webhub4U",
  description:
    "Explore after-hours call handling, missed-call follow-up and calendar integration for your GTA business. Request a demonstration.",
  robots: { index: false, follow: false },
};

// Message-matched to search intent (solution-aware). ?v=b for A/B testing.
const COPY = {
  a: {
    eyebrow: "AI Receptionist · Serving the GTA",
    h1: "The AI receptionist that books jobs while you work.",
    sub: "Explore call handling in your business name, missed-call follow-up and calendar integration. Coverage and fallback depend on your tools and agreed setup.",
    ctaPrimary: "Hear it live",
    formHeading: "Hear exactly what your callers would hear.",
  },
  b: {
    eyebrow: "AI Receptionist · Serving the GTA",
    h1: "Give callers another way to reach your business.",
    sub: "Your AI receptionist answers on the first ring, day or night, and books the job — so the lead you paid to earn doesn't call the next guy.",
    ctaPrimary: "Get my free demo",
    formHeading: "Request a live demo.",
  },
};

export default function Page({ searchParams }) {
  const variant = searchParams?.v === "b" ? "b" : "a";
  return <LandingPage copy={COPY[variant]} source={`lp-google-${variant}`} />;
}
