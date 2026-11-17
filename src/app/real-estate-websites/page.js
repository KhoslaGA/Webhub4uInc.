import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import ScrollSequence from "@/components/sections/new/ScrollSequence";
import FaqBlock from "@/components/sections/new/FaqBlock";
import CtaNew from "@/components/sections/new/CtaNew";
import JsonLd from "@/components/seo/JsonLd";
import { REAL_ESTATE } from "@/lib/business";
import { faqLd } from "@/lib/schema";
import styles from "@/components/sections/new/RealEstatePage.module.css";

const PREVIEW_HREF = "/contact?service=real-estate-websites#project-enquiry";

export const metadata = {
  title: "Cinematic Real Estate & Cottage Rental Websites | Webhub4U",
  description:
    "Scroll-driven property walkthroughs built from your ordered photos, on a fast website you own. For cottage and short-term rentals, builders and realtor teams in Ontario.",
  alternates: { canonical: "/real-estate-websites" },
  openGraph: {
    title: "Cinematic Property Websites — Webhub4U",
    description:
      "Let buyers and guests walk through a property before they visit, with a scroll-driven walkthrough built from your photos.",
    url: "https://www.webhub4u.com/real-estate-websites",
    type: "website",
  },
  // noindex until a real demo sequence exists — flip REAL_ESTATE.indexable.
  ...(REAL_ESTATE.indexable ? {} : { robots: { index: false, follow: true } }),
};

/**
 * Read the demo manifest at build time. Returns null when the frames have not
 * been generated, so the page renders the static explainer instead of an
 * empty canvas.
 */
function readDemo(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || "")) return null;
  const file = path.join(process.cwd(), "public", "demos", slug, "manifest.json");
  try {
    if (!fs.existsSync(file)) return null;
    const m = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(m.frames) || !m.frames.length) return null;
    const base = `/demos/${slug}/`;
    return { manifestUrl: `${base}manifest.json`, poster: m.poster ? base + m.poster : undefined };
  } catch {
    return null;
  }
}

const AUDIENCES = [
  {
    t: "Cottage & short-term rentals",
    d: "A direct-booking site for your property, with a walkthrough guests can scroll before they book. Your booking engine's widget is embedded on the page, so reservations stay in the system you already use.",
  },
  {
    t: "Builders & developers",
    d: "A signature site for a project that sells over 12–24 months. Spaces that aren't built yet are shown as concept renderings and captioned that way.",
  },
  {
    t: "Realtor teams",
    d: "A walkthrough film and microsite per listing — something concrete to show sellers at a listing appointment, and to share with buyers.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Send your photos, in order",
    d: "Your existing listing photos, ordered the way you'd walk someone through: approach, entry, main rooms, outdoor space. The photo order becomes the camera path.",
  },
  {
    n: "02",
    t: "We produce the walkthrough",
    d: "We turn the sequence into a short film and cut it into frames. Anything generated or staged by software is labelled before you see it.",
  },
  {
    n: "03",
    t: "We build the site",
    d: "A fast site around the walkthrough: property details, location, enquiry form, and your booking-engine embed where you have one.",
  },
  {
    n: "04",
    t: "Launch and handover",
    d: "We launch on your domain and hand over the site and its source files. You own them.",
  },
];

const BEHAVIOUR = [
  {
    t: "A film, cut into frames",
    d: "A short walkthrough clip is exported as a sequence of still frames, sized separately for desktop and phones.",
  },
  {
    t: "Scrolling moves the camera",
    d: "As the visitor scrolls, the page steps through the frames — forward and back, at their pace.",
  },
  {
    t: "Light on phones",
    d: "The first frame shows straight away, the rest load progressively, and nothing runs while the section is off-screen. Visitors who prefer reduced motion get a still image and a standard video instead.",
  },
];

const FAQS = [
  {
    q: "How long does it take?",
    a: "It depends on the number of photos and pages. The free preview is a 15-second walkthrough made from photos you already have. For a full site, we give you a schedule once we've seen the photos and agreed the scope.",
  },
  {
    q: "What photos do you need?",
    a: "The photos you already have for the listing, in the order you'd walk someone through the property. Higher resolution and consistent landscape orientation give the smoothest result. If there are gaps in the sequence, we'll tell you which shots are missing before we start.",
  },
  {
    q: "Will it be slow on phones?",
    a: "Phones get smaller frames than desktops, the first frame appears immediately and the rest load in the background. The walkthrough pauses when it's off-screen, and visitors who prefer reduced motion get a still image and a regular video instead of scroll animation.",
  },
  {
    q: "Does it work with my booking engine?",
    a: "Most rental platforms — for example Hostaway, Lodgify and OwnerRez — provide a booking widget or link that can be embedded. Compatibility depends on your platform and account, so we confirm it for your property as part of scoping.",
  },
  {
    q: "How do you label AI imagery?",
    a: "Walkthroughs of a real property start from that property's real photos. Where software generates motion or in-between frames, or stages a room, the page says so with a visible label. Projects that aren't built yet are shown as concept renderings and captioned that way.",
  },
  {
    q: "How much does it cost?",
    a: "It's scoped per property, based on the number of photos, pages and integrations. Start with a free 15-second preview and we'll quote from there.",
  },
];

export default function RealEstateWebsites() {
  const demo = readDemo(REAL_ESTATE.demoSlug);
  const priceLine = REAL_ESTATE.priceFrom
    ? `From ${REAL_ESTATE.priceFrom}`
    : "Scoped per property — request a free preview";

  return (
    <PageShell>
      <JsonLd data={faqLd(FAQS)} />

      {/* ---------- HERO ---------- */}
      <PageHero
        eyebrow="Cinematic property websites"
        title={
          <>
            Let buyers <span className="wh-em">walk through</span> before they visit.
          </>
        }
        sub="We turn your ordered property photos into a short walkthrough, then build a fast site where scrolling moves the camera from room to room."
      >
        <div className={styles.heroCtas}>
          <Link href={PREVIEW_HREF} className="wh-btn wh-btn--primary">
            Get a free 15-second preview <span aria-hidden="true">↗</span>
          </Link>
          <a href="#how" className="wh-btn wh-btn--ghost-dark">
            How it works
          </a>
        </div>
        <p className={styles.heroNote}>{priceLine}</p>
      </PageHero>

      {/* ---------- DEMO (or static explainer when no frames exist) ---------- */}
      {demo ? (
        <>
          <section className={`wh ${styles.demoIntro}`} id="demo">
            <div className="wh-inner">
              <p className="wh-eyebrow">Concept demo</p>
              <h2 className={`wh-display ${styles.h2}`}>
                Scroll to <span className="wh-em">move through it.</span>
              </h2>
              <p className={styles.lead}>
                The walkthrough below is a concept made to show the format. It is
                not a client property.
              </p>
            </div>
          </section>
          <ScrollSequence
            manifestUrl={demo.manifestUrl}
            poster={demo.poster}
            caption={REAL_ESTATE.demoCaption}
          />
        </>
      ) : (
        <section className={`wh ${styles.explainer}`} id="demo">
          <div className="wh-inner">
            <p className="wh-eyebrow">How the walkthrough behaves</p>
            <h2 className={`wh-display ${styles.h2}`}>
              A short film, <span className="wh-em">driven by the scroll.</span>
            </h2>
            <div className={styles.behaviour}>
              {BEHAVIOUR.map((b) => (
                <article key={b.t}>
                  <h3>{b.t}</h3>
                  <p>{b.d}</p>
                </article>
              ))}
            </div>
            <div className={styles.explainerCta}>
              <p>
                There&apos;s no public demo on this page yet. Ask for a free
                15-second preview made from your own property photos.
              </p>
              <Link href={PREVIEW_HREF} className="wh-btn wh-btn--primary">
                Request a preview <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- WHO IT'S FOR ---------- */}
      <section className={`wh ${styles.who}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">Who it&apos;s for</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Built for properties that <span className="wh-em">sell on space.</span>
          </h2>
          <div className={styles.cards}>
            {AUDIENCES.map((a) => (
              <article key={a.t} className={styles.card}>
                <h3>{a.t}</h3>
                <p>{a.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className={`wh ${styles.how}`} id="how">
        <div className="wh-inner">
          <p className="wh-eyebrow">How it works</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Your photo order is <span className="wh-em">the camera path.</span>
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
          <Link href={PREVIEW_HREF} className={`wh-btn wh-btn--primary ${styles.howCta}`}>
            Get a free 15-second preview <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* ---------- HONESTY ---------- */}
      <section className={`wh ${styles.honesty}`}>
        <div className={`wh-inner ${styles.honestyInner}`}>
          <p className={`wh-eyebrow ${styles.honestyEyebrow}`}>What you see is labelled</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Real photos for real listings. <span className="wh-em">Labels for the rest.</span>
          </h2>
          <ul className={styles.rules}>
            <li>Walkthroughs of a real property start from that property&apos;s real photos.</li>
            <li>
              Anything generated or staged by software — motion between photos,
              in-between frames, virtual staging — carries a visible label.
            </li>
            <li>Projects that aren&apos;t built yet are captioned as concept renderings.</li>
            <li>Demos on this site are concepts, not client work.</li>
          </ul>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={`wh ${styles.faq}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">Questions</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Before you <span className="wh-em">send photos.</span>
          </h2>
          <FaqBlock items={FAQS} />
        </div>
      </section>

      <CtaNew />
    </PageShell>
  );
}
