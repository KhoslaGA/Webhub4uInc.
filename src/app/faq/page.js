import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import FAQNew from "@/components/sections/new/FAQNew";
import CtaNew from "@/components/sections/new/CtaNew";

export const metadata = {
  alternates: { canonical: "/faq" },
  title: "FAQ | Webhub4U — Web Design & AI Questions Answered",
  description:
    "Common questions about our websites, AI receptionists, chatbots, pricing, timelines, and ownership.",
};

export default function FAQ() {
  return (
    <PageShell>
      <PageHero
        eyebrow="FAQ"
        title={<>Good questions, <span className="wh-em">straight answers.</span></>}
        sub="Everything people ask before working with us. Don't see yours? Just reach out — we answer honestly."
      />
      <FAQNew />
      <CtaNew />
    </PageShell>
  );
}
