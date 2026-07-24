import Image from "next/image";
import Link from "next/link";
import AITerminal from "./AITerminal";
import DemoRequestForm from "./DemoRequestForm";
import PhoneLink from "./PhoneLink";
import BookingEmbed from "./BookingEmbed";
import { BUSINESS, OFFER } from "@/lib/business";
import styles from "./LandingPage.module.css";

// NAP-safe DNI: ad pages can route to a call-tracking number without touching
// the canonical business phone used in JSON-LD / citations.
const LP_PHONE = process.env.NEXT_PUBLIC_LP_TRACKING_PHONE || BUSINESS.phone;

const VALUES = [
  { t: "Answers 24/7", d: "Every call, day or night — never a voicemail again." },
  { t: "Texts back instantly", d: "Missed calls get a friendly text in seconds, so the lead stays warm." },
  { t: "Books the job", d: "Appointments drop straight into your calendar while you work." },
];

/**
 * Shared PPC landing-page template — no site nav, single conversion goal
 * (the demo form), message-matched copy passed in per channel/variant.
 * Rendered by /lp/* routes, which set robots noindex.
 */
export default function LandingPage({ copy, source }) {
  const { monthly } = OFFER.aiReceptionist;
  return (
    <div className="wh">
      {/* minimal header — logo + phone only, no nav */}
      <header className={styles.header}>
        <div className={`wh-inner ${styles.headerInner}`}>
          <Link href="/" className={styles.logo} aria-label="Webhub4U">
            <Image
              src="/logo-nav-t.png"
              alt="Webhub4U"
              width={150}
              height={73}
              priority
            />
          </Link>
          <PhoneLink
            source={`${source}-header`}
            className={styles.headerPhone}
            number={LP_PHONE}
          />
        </div>
      </header>

      {/* hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={`wh-inner ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={`wh-eyebrow ${styles.eyebrow}`}>{copy.eyebrow}</p>
            <h1 className={`wh-display ${styles.h1}`}>{copy.h1}</h1>
            <p className={styles.sub}>{copy.sub}</p>
            <div className={styles.ctas}>
              <a href="#lp-demo" className="wh-btn wh-btn--primary">
                {copy.ctaPrimary}
              </a>
              <PhoneLink
                source={`${source}-hero`}
                className="wh-btn wh-btn--ghost-dark"
                number={LP_PHONE}
              >
                📞 {LP_PHONE}
              </PhoneLink>
            </div>
            <p className={styles.reassure}>
              ${monthly}/mo · month-to-month · first month free if it misses
            </p>
          </div>
          <div className={styles.heroTerminal}>
            <AITerminal />
          </div>
        </div>
      </section>

      {/* value points */}
      <section className={styles.values}>
        <div className={`wh-inner ${styles.valuesGrid}`}>
          {VALUES.map((v) => (
            <div key={v.t} className={styles.value}>
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>{v.t}</strong>
                <p>{v.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* demo form — the single conversion goal */}
      <section className={styles.demo} id="lp-demo">
        <div className={`wh-inner ${styles.demoInner}`}>
          <div className={styles.demoCopy}>
            <h2 className={`wh-display ${styles.demoH}`}>{copy.formHeading}</h2>
            <p className={styles.demoP}>
              Leave your number and we&apos;ll set up a live demo on your own
              business — five minutes, no pressure. You&apos;ll hear exactly
              what your callers would hear.
            </p>
          </div>
          <div className={styles.formCard}>
            <DemoRequestForm source={source} />
          </div>
        </div>
      </section>

      {/* self-booking (dormant until NEXT_PUBLIC_GHL_CALENDAR_URL is set) */}
      <BookingEmbed />

      {/* minimal footer — no nav */}
      <footer className={styles.footer}>
        <div className="wh-inner">
          <p>
            © {new Date().getFullYear()} Webhub4u Inc. · Brampton, ON ·{" "}
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
