import LandingPage from "@/components/sections/new/LandingPage";

export const metadata = {
  title: "Stop Losing Jobs to Voicemail | Webhub4U",
  description:
    "Every missed call is a missed job. An AI receptionist answers 24/7, texts back missed calls, and books the work. See it on your own business.",
  robots: { index: false, follow: false },
};

// Message-matched to interruption/social intent (problem-aware). ?v=b for A/B.
const COPY = {
  a: {
    eyebrow: "For GTA trades & local businesses",
    h1: "Missing calls is costing you jobs.",
    sub: "You can't answer every call — but you can stop losing the work. An AI receptionist answers 24/7, texts back missed calls, and books the job for you.",
    ctaPrimary: "Show me how",
    formHeading: "See it on your own business.",
  },
  b: {
    eyebrow: "For GTA trades & local businesses",
    h1: "Your phone, answered 24/7 — even when you can't.",
    sub: "On a ladder, driving, or with a customer? Your AI receptionist picks up, answers questions, and books appointments — with escalation and fallback scoped to your business.",
    ctaPrimary: "Get my free demo",
    formHeading: "Set up your live demo.",
  },
};

export default function Page({ searchParams }) {
  const variant = searchParams?.v === "b" ? "b" : "a";
  return <LandingPage copy={COPY[variant]} source={`lp-meta-${variant}`} />;
}
