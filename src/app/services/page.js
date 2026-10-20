import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import PricingNew from "@/components/sections/new/PricingNew";
import CtaNew from "@/components/sections/new/CtaNew";
import styles from "@/components/sections/new/ServicesPage.module.css";

export const metadata = {
  alternates: { canonical: "/services" },
  title: "Services | Web Design, Local SEO & AI Tools — Webhub4U",
  description:
    "Websites, local SEO, AI receptionists, chatbots, and automation for GTA businesses. See what Webhub4U builds and how each service helps you win.",
};

const GROUPS = [
  {
    label: "Web",
    items: [
      { t: "Web Design & Development", d: "Fast, modern, mobile-first websites built to convert. Custom-coded on a modern stack — not a bloated template." },
      { t: "E-Commerce", d: "Shopify or custom online stores with products, payments, and shipping configured properly." },
      { t: "Branding & Identity", d: "Logos, colour, and messaging that make a small business look established and trustworthy." },
    ],
  },
  {
    label: "AI",
    items: [
      { t: "AI Receptionist", d: "Answers after-hours calls, texts back missed ones, and books appointments — so you never lose a job to voicemail." },
      { t: "AI Chat Assistant", d: "A website assistant trained on your business that answers questions and captures leads 24/7." },
      { t: "Business Automation", d: "Quotes, invoices, follow-ups, and CRM updates that run themselves via AI-powered workflows." },
    ],
  },
  {
    label: "Growth",
    items: [
      { t: "Local SEO", d: "Google Business Profile optimization, city landing pages, and a reviews strategy that gets you found." },
      { t: "Care Plans & Hosting", d: "Updates, backups, security, and monthly edits so your site stays fast, safe, and current." },
    ],
  },
];

export default function Services() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title={<>Everything you need to <span className="wh-em">win online.</span></>}
        sub="From your first website to AI tools that work while you sleep — here's what we build, and why each piece earns its place."
      />
      <section className={`wh ${styles.wrap}`}>
        <div className="wh-inner">
          {GROUPS.map((g) => (
            <div key={g.label} className={styles.group}>
              <p className={`wh-eyebrow ${styles.groupLabel}`}>{g.label}</p>
              <div className={styles.items}>
                {g.items.map((it) => (
                  <div key={it.t} className={styles.item}>
                    <h3>{it.t}</h3>
                    <p>{it.d}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <PricingNew />
      <CtaNew />
    </PageShell>
  );
}
