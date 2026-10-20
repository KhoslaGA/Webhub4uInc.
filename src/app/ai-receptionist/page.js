import PageShell from "@/components/sections/new/PageShell";
import ConstellationBg from "@/components/sections/new/ConstellationBg";
import AITerminal from "@/components/sections/new/AITerminal";
import RoiCalculator from "@/components/sections/new/RoiCalculator";
import FaqBlock from "@/components/sections/new/FaqBlock";
import DemoRequestForm from "@/components/sections/new/DemoRequestForm";
import StickyCallCta from "@/components/sections/new/StickyCallCta";
import PhoneLink from "@/components/sections/new/PhoneLink";
import CtaNew from "@/components/sections/new/CtaNew";
import Link from "next/link";
import { BUSINESS, OFFER, telHref } from "@/lib/business";
import styles from "@/components/sections/new/AiReceptionistPage.module.css";

const { setup, monthly } = OFFER.aiReceptionist;

export const metadata = {
  title: "AI Receptionist for GTA Businesses | Never Miss a Call — Webhub4U",
  description:
    "An AI receptionist that answers every call, texts back missed ones, and books jobs straight into your calendar — 24/7. Built for GTA trades and local businesses. Hear it live.",
  alternates: { canonical: "/ai-receptionist" },
  openGraph: {
    title: "Never Miss Another Call — AI Receptionist by Webhub4U",
    description:
      "Answers, texts back, and books appointments 24/7 so you never lose a job to voicemail.",
    url: "https://www.webhub4u.com/ai-receptionist",
    type: "website",
  },
};

const STEPS = [
  {
    n: "01",
    t: "We connect your number",
    d: "Keep your existing business line. We forward missed and after-hours calls to your AI receptionist — no porting, no new number to memorize.",
  },
  {
    n: "02",
    t: "It answers & books",
    d: "Trained on your business, it greets callers by your name, answers common questions, and drops booked jobs straight into your calendar.",
  },
  {
    n: "03",
    t: "You get the job",
    d: "You get a text and a full transcript for every call. The lead that used to hit voicemail is now a confirmed appointment.",
  },
];

const INCLUDES = [
  "Answers every call, 24/7 — after hours, weekends, on the job site",
  "Texts back missed calls instantly so the lead never goes cold",
  "Books appointments into your calendar",
  "Trained only on info you approve — escalates anything it can't handle",
  "Full call transcripts + recordings in your dashboard",
  "Ongoing monitoring and tuning by us",
];

const FAQS = [
  {
    q: "What if it says something wrong to a customer?",
    a: "It only answers from information you approve, with strict guardrails. Anything outside that gets taken as a message and passed to you — it never guesses. You review everything it's allowed to say before it goes live.",
  },
  {
    q: "Can I listen to the calls?",
    a: "Yes. Every call comes with a full transcript and recording in your dashboard, plus a text summary the moment it ends. You see exactly what your callers heard.",
  },
  {
    q: "What about my existing number?",
    a: "You keep it. We forward missed and after-hours calls to the AI receptionist, so nothing changes for your customers. Prefer it to answer everything, or want to port the number? Your call — both work.",
  },
  {
    q: "How long does setup take?",
    a: "Usually about a week. We learn your services, your booking rules, and your FAQs, configure the assistant, and test it with you before it takes a single real call.",
  },
  {
    q: "Am I locked into a contract?",
    a: "No. It's month-to-month — cancel anytime. And if it misses in your first month, that month is free.",
  },
  {
    q: "Will it sound like a robot?",
    a: "No. It uses a natural voice, greets callers with your business name, and speaks in a tone we set with you. Most callers just hear a helpful receptionist.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Receptionist",
  name: "AI Receptionist",
  description:
    "A 24/7 AI receptionist that answers calls, texts back missed calls, and books appointments for local businesses in the Greater Toronto Area.",
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
    ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
  },
  offers: {
    "@type": "Offer",
    price: monthly,
    priceCurrency: "CAD",
    description: `$${setup} setup, then $${monthly}/month`,
  },
};

const tel = telHref(BUSINESS.demoPhone);

export default function AiReceptionist() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* ---------- HERO ---------- */}
      <section className={`wh ${styles.hero}`}>
        <ConstellationBg />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`wh-inner ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={`wh-eyebrow ${styles.heroEyebrow}`}>AI Receptionist</p>
            <h1 className={`wh-display ${styles.h1}`}>
              Never miss another call. <span className="wh-em">Ever.</span>
            </h1>
            <p className={styles.heroSub}>
              Every missed call is a missed job. Your AI receptionist answers on
              the first ring — day or night — texts back missed calls, and books
              the work straight into your calendar. You just show up.
            </p>
            <div className={styles.heroCtas}>
              <a href="#demo" className="wh-btn wh-btn--primary">
                Hear it live
              </a>
              <a href="#roi" className="wh-btn wh-btn--ghost-dark">
                What am I losing?
              </a>
            </div>
            <p className={styles.heroTrust}>
              Built in Brampton · Serving the GTA · Month-to-month
            </p>
          </div>
          <div className={styles.heroTerminal}>
            <AITerminal />
          </div>
        </div>
      </section>

      {/* ---------- PAIN STRIP ---------- */}
      <section className={`wh ${styles.strip}`}>
        <div className={`wh-inner ${styles.stripInner}`}>
          <div className={styles.stat}>
            <span className={styles.statBig}>1 in 4</span>
            <span className={styles.statLabel}>
              calls to small businesses go unanswered
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statBig}>80%</span>
            <span className={styles.statLabel}>
              of callers won&apos;t leave a voicemail — they call the next guy
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statBig}>24/7</span>
            <span className={styles.statLabel}>
              your receptionist is awake, even when you&apos;re not
            </span>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className={`wh ${styles.how}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">How it works</p>
          <h2 className={`wh-display ${styles.h2}`}>
            From missed call to <span className="wh-em">booked job.</span>
          </h2>
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepN}>{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ROI ---------- */}
      <section className={`wh ${styles.roi}`} id="roi">
        <div className="wh-inner">
          <p className="wh-eyebrow">The math</p>
          <h2 className={`wh-display ${styles.h2}`}>
            See it in <span className="wh-em">dollars.</span>
          </h2>
          <p className={styles.roiSub}>
            Most of our clients recover the monthly cost with a single saved
            job. Slide in your numbers.
          </p>
          <RoiCalculator monthlyCost={monthly} />
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section className={`wh ${styles.pricing}`} id="pricing">
        <div className="wh-inner">
          <p className="wh-eyebrow">Pricing</p>
          <h2 className={`wh-display ${styles.h2}`}>
            One plan. <span className="wh-em">No surprises.</span>
          </h2>
          <div className={styles.priceCard}>
            <div className={styles.priceHead}>
              <div>
                <p className={styles.priceName}>AI Receptionist</p>
                <p className={styles.priceMeta}>
                  Everything set up, trained, and monitored for you.
                </p>
              </div>
              <div className={styles.priceFig}>
                <span className={styles.priceSetup}>${setup}</span>
                <span className={styles.priceSetupLabel}>one-time setup</span>
                <span className={styles.priceMonthly}>
                  then ${monthly}
                  <span>/mo</span>
                </span>
              </div>
            </div>
            <ul className={styles.includes}>
              {INCLUDES.map((i) => (
                <li key={i}>
                  <span className={styles.check}>✓</span>
                  {i}
                </li>
              ))}
            </ul>
            <a href="#demo" className={`wh-btn wh-btn--primary ${styles.priceCta}`}>
              Get my live demo
            </a>
          </div>
        </div>
      </section>

      {/* ---------- GUARANTEE ---------- */}
      <section className={`wh ${styles.guarantee}`}>
        <div className={`wh-inner ${styles.guaranteeInner}`}>
          <span className={styles.guaranteeBadge}>Our promise</span>
          <h2 className={`wh-display ${styles.guaranteeH}`}>
            If it misses in your first month, <span className="wh-em">that month&apos;s free.</span>
          </h2>
          <p className={styles.guaranteeP}>
            We only win when you stop losing calls. No long contracts, no setup
            traps — cancel anytime.
          </p>
          <Link
            href="/guarantee"
            className={`wh-btn wh-btn--ghost-dark ${styles.guaranteeCta}`}
          >
            Read the full guarantee →
          </Link>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={`wh ${styles.faq}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">Questions</p>
          <h2 className={`wh-display ${styles.h2}`}>
            The stuff you&apos;re <span className="wh-em">actually wondering.</span>
          </h2>
          <FaqBlock items={FAQS} />
        </div>
      </section>

      {/* ---------- DEMO FORM ---------- */}
      <section className={`wh ${styles.demo}`} id="demo">
        <div className={`wh-inner ${styles.demoInner}`}>
          <div className={styles.demoCopy}>
            <p className="wh-eyebrow">Hear it live</p>
            <h2 className={`wh-display ${styles.h2}`}>
              Hear exactly what your <span className="wh-em">callers would hear.</span>
            </h2>
            <p className={styles.demoP}>
              Leave your number and we&apos;ll set up a live demo on your own
              business — no slides, no pressure. You&apos;ll know in five minutes
              whether it&apos;s right for you.
            </p>
            <p className={styles.demoPhone}>
              Prefer to talk to a person? <PhoneLink source="ai-receptionist-demo" />
            </p>
            {tel && (
              <p className={styles.demoPhone}>
                Or <a href={tel}>call the AI demo line →</a> to hear it live.
              </p>
            )}
          </div>
          <div className={styles.demoFormWrap}>
            <DemoRequestForm source="webhub4u.com/ai-receptionist" />
          </div>
        </div>
      </section>

      <CtaNew />
      <StickyCallCta />
    </PageShell>
  );
}
