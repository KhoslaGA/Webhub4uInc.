import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import Link from "next/link";
import styles from "@/components/sections/new/AboutPage.module.css";

export const metadata = {
  alternates: { canonical: "/about" },
  title: "About | Webhub4U — Web Design & AI Agency in Brampton",
  description:
    "Webhub4U is a Brampton-based digital studio building websites, local SEO, and AI tools for GTA businesses. Meet the team and how we work.",
};

const VALUES = [
  { t: "Honest by default", d: "We publish our prices, tell you when you don't need something, and won't upsell you into things that don't move the needle." },
  { t: "Built to perform", d: "Pretty is table stakes. We build for speed, search rankings, and turning visitors into customers." },
  { t: "AI-native", d: "We use the same AI we sell — every day. That's why we can set it up properly for your business instead of guessing." },
  { t: "Genuinely local", d: "We're in Brampton and we serve the GTA. We can meet you at your shop, not just over email." },
];

export default function About() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About Webhub4U"
        title={<>A small studio with a <span className="wh-em">big toolkit.</span></>}
        sub="We help GTA businesses look established, get found, and stop missing leads — with modern websites and the practical AI tools most agencies are still figuring out."
      />
      <section className={`wh ${styles.story}`}>
        <div className={`wh-inner ${styles.storyGrid}`}>
          <div>
            <p className="wh-eyebrow">Our story</p>
            <h2 className={`wh-display ${styles.h2}`}>
              Why we exist
            </h2>
          </div>
          <div className={styles.storyText}>
            <p>
              Most small businesses are stuck with one of two bad options: a
              $20-a-month template that looks like everyone else&apos;s, or a
              downtown agency that quotes $15,000 and disappears behind account
              managers.
            </p>
            <p>
              Webhub4U is the middle path. You get a modern, fast,
              search-ready website at a fair, published price — built by the
              same person you talk to on your first call. And because we build
              with AI as our core toolkit, we can add tools that used to be
              enterprise-only: an assistant that answers your phone, a chatbot
              that books appointments, automations that handle the busywork.
            </p>
            <p>
              We&apos;re based in Brampton and we work with businesses across
              the Greater Toronto Area — trades, clinics, professional
              services, and local shops that are ready to look as good online
              as they are in person.
            </p>
          </div>
        </div>
      </section>
      <section className={`wh ${styles.values}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">What we stand for</p>
          <h2 className={`wh-display ${styles.h2}`}>Our principles</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.t} className={styles.value}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaNew />
    </PageShell>
  );
}
