import PageShell from "@/components/sections/new/PageShell";
import FaqBlock from "@/components/sections/new/FaqBlock";
import DemoRequestForm from "@/components/sections/new/DemoRequestForm";
import PhoneLink from "@/components/sections/new/PhoneLink";
import CtaNew from "@/components/sections/new/CtaNew";
import Link from "next/link";
import { BUSINESS, OFFER } from "@/lib/business";
import styles from "@/components/sections/new/MissedCallPage.module.css";

const { monthly } = OFFER.missedCallTextBack;

export const metadata = {
  title: "Missed Call Text-Back for GTA Businesses | Webhub4U",
  description:
    "Every missed call gets an instant, friendly text back — so the lead never goes cold. Simple, automatic, and cheaper than losing one job. Serving Brampton & the GTA.",
  alternates: { canonical: "/missed-call-text-back" },
  openGraph: {
    title: "Missed Call? They Get an Instant Text Back — Webhub4U",
    description:
      "Turn missed calls into booked jobs with an automatic text-back. From $" +
      monthly +
      "/mo.",
    url: "https://www.webhub4u.com/missed-call-text-back",
    type: "website",
  },
};

const THREAD = [
  { type: "system", text: "Missed call · (416) 555-0192 · 7:42 PM" },
  {
    type: "out",
    text: "Hi! Sorry we missed your call — this is Dave's Plumbing. How can we help?",
  },
  { type: "in", text: "Burst pipe under my kitchen sink 😩" },
  { type: "out", text: "Yikes! We can be there tomorrow 9am. Want me to book it?" },
  { type: "in", text: "Yes please 🙏" },
  { type: "system", text: "✓ Job booked — added to calendar" },
];

const STEPS = [
  {
    t: "A call comes in unanswered",
    d: "You're on a ladder, driving, or already with a customer. It happens.",
  },
  {
    t: "We text them back instantly",
    d: "Within seconds, they get a friendly message from your business — not silence.",
  },
  {
    t: "The conversation keeps going",
    d: "They reply, you (or your AI) book the job. The lead that would've vanished is saved.",
  },
];

const FAQS = [
  {
    q: "How is this different from the AI receptionist?",
    a: "This is the simple, entry-level version: it texts back missed calls automatically so leads don't go cold. The AI receptionist actually answers the phone, holds a conversation, and books appointments live. Many businesses start here and upgrade.",
  },
  {
    q: "Does it work with my current phone number?",
    a: "Yes. We set it up on your existing business line — nothing changes for how you make or take calls. It only kicks in when a call goes unanswered.",
  },
  {
    q: "What does the text say?",
    a: "Whatever you want. We write it with you — friendly, on-brand, and set up to start a real conversation instead of a dead-end auto-reply.",
  },
  {
    q: "Is there a contract?",
    a: "No — month-to-month, cancel anytime. It costs less than a single job you'd lose to a missed call.",
  },
];

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Missed Call Text-Back",
  name: "Missed Call Text-Back",
  description:
    "Automatically texts back missed calls for local businesses so leads never go cold. Serving the Greater Toronto Area.",
  areaServed: BUSINESS.areaServed,
  provider: {
    "@type": "ProfessionalService",
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
  },
  offers: {
    "@type": "Offer",
    price: monthly,
    priceCurrency: "CAD",
    description: `$${monthly}/month`,
  },
};

export default function MissedCallTextBack() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />

      {/* ---------- HERO ---------- */}
      <section className={`wh ${styles.hero}`}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`wh-inner ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={`wh-eyebrow ${styles.heroEyebrow}`}>
              Missed Call Text-Back
            </p>
            <h1 className={`wh-display ${styles.h1}`}>
              Missed a call? They just got a <span className="wh-em">text back.</span>
            </h1>
            <p className={styles.heroSub}>
              You can&apos;t answer every call — but you can make sure no one is
              left with silence. Every missed call gets an instant, friendly
              text, so the lead keeps talking instead of calling your competitor.
            </p>
            <div className={styles.heroCtas}>
              <a href="#start" className="wh-btn wh-btn--primary">
                Set it up — ${monthly}/mo
              </a>
              <Link href="/ai-receptionist" className="wh-btn wh-btn--ghost-dark">
                Want it to answer too?
              </Link>
            </div>
          </div>

          {/* phone mockup */}
          <div className={styles.phoneWrap}>
            <div className={styles.phone}>
              <div className={styles.notch} />
              <div className={styles.thread}>
                {THREAD.map((m, i) =>
                  m.type === "system" ? (
                    <div key={i} className={styles.sys}>
                      {m.text}
                    </div>
                  ) : (
                    <div
                      key={i}
                      className={`${styles.bubble} ${
                        m.type === "out" ? styles.out : styles.in
                      }`}
                    >
                      {m.text}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BEFORE / AFTER ---------- */}
      <section className={`wh ${styles.contrast}`}>
        <div className={`wh-inner ${styles.contrastInner}`}>
          <div className={`${styles.card} ${styles.without}`}>
            <p className={styles.cardLabel}>Without it</p>
            <p className={styles.cardLine}>Missed call →</p>
            <p className={styles.cardLine}>voicemail (that no one leaves) →</p>
            <p className={styles.cardLine}>they call the next business.</p>
            <p className={styles.cardOut}>Lead gone.</p>
          </div>
          <div className={`${styles.card} ${styles.with}`}>
            <p className={styles.cardLabel}>With it</p>
            <p className={styles.cardLine}>Missed call →</p>
            <p className={styles.cardLine}>instant friendly text →</p>
            <p className={styles.cardLine}>they reply, you book it.</p>
            <p className={styles.cardWin}>Job saved.</p>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className={`wh ${styles.how}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">How it works</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Three seconds, <span className="wh-em">fully automatic.</span>
          </h2>
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={s.t} className={styles.step}>
                <span className={styles.stepN}>{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section className={`wh ${styles.pricing}`}>
        <div className={`wh-inner ${styles.pricingInner}`}>
          <div className={styles.priceCard}>
            <p className={styles.priceName}>Missed Call Text-Back</p>
            <p className={styles.priceFig}>
              ${monthly}<span>/mo</span>
            </p>
            <p className={styles.priceMeta}>
              Set up on your existing number · month-to-month · cancel anytime
            </p>
            <ul className={styles.includes}>
              <li>Instant auto-text on every missed call</li>
              <li>Custom message written with you</li>
              <li>Works with your current phone line</li>
              <li>Upgrade to the full AI receptionist anytime</li>
            </ul>
            <a href="#start" className={`wh-btn wh-btn--primary ${styles.priceCta}`}>
              Get started
            </a>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={`wh ${styles.faq}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">Questions</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Good <span className="wh-em">to know.</span>
          </h2>
          <FaqBlock items={FAQS} />
        </div>
      </section>

      {/* ---------- START ---------- */}
      <section className={`wh ${styles.start}`} id="start">
        <div className={`wh-inner ${styles.startInner}`}>
          <div className={styles.startCopy}>
            <p className="wh-eyebrow">Get started</p>
            <h2 className={`wh-display ${styles.h2}`}>
              Stop losing jobs to <span className="wh-em">voicemail.</span>
            </h2>
            <p className={styles.startP}>
              Leave your number — we&apos;ll get you set up in a day, and show
              you the AI receptionist too if you want to see it.
            </p>
            <p className={styles.callLine}>
              Prefer to call? <PhoneLink source="missed-call-start" />
            </p>
          </div>
          <div className={styles.startFormWrap}>
            <DemoRequestForm source="webhub4u.com/missed-call-text-back" />
          </div>
        </div>
      </section>

      <CtaNew />
    </PageShell>
  );
}
