import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import styles from "@/components/sections/new/CaseStudy.module.css";

export const metadata = {
  title: "RateFamily: Web Development & SEO Case Study | Webhub4U",
  description:
    "Explore RateFamily: four Canadian education brands, shared web development and technical SEO foundations. Learn about the platform and its development status.",
  alternates: { canonical: "/projects/rate-family" },
};

/*
 * Audited 2026-10-29 against the production repository (KhoslaGA/Toprates
 * @ 59dd713) and the separate V2 development app (KhoslaGA/Rate-Family-V2
 * @ 08b1967). Sources, counting method and verdicts:
 * docs/case-study-audit-2026-10-29.md. Production facts and V2 facts stay in
 * separate sections. Add outcome metrics only with a dated, shareable
 * measurement source.
 */

const SITES = [
  { name: "TopRates.ca", href: "https://www.toprates.ca", focus: "The hub — insurance, mortgages and credit cards" },
  { name: "LifeRate.ca", href: "https://www.liferate.ca", focus: "Life and critical illness insurance" },
  { name: "TermRates.ca", href: "https://www.termrates.ca", focus: "Mortgages" },
  { name: "HealthRate.ca", href: "https://www.healthrate.ca", focus: "Health, travel and Super Visa insurance" },
];

// The production network: the one codebase that serves all four public sites.
const BUILT = [
  {
    t: "One app, four sites",
    d: "A single Next.js application serves all four brands. Each request resolves its brand from the domain, which sets that site's look, navigation, content and search identity.",
  },
  {
    t: "One content model, four brands",
    d: "One Sanity CMS model with 9 document types. Every editorial type (articles, city pages, glossary terms, briefings, authors, categories) is scoped to the brand that owns it.",
  },
  {
    t: "Search plumbing for a multi-domain network",
    d: "Canonical URLs, sitemaps and structured data come from each brand's own domain. Every production build runs a check that fails if a sitemap lists another brand's URL, and new URLs are submitted to IndexNow after production deploys.",
  },
  {
    t: "Guardrails written as code",
    d: "20+ check scripts run in a pre-merge test gate: canonical ownership, noindex rules, mock-quote labelling, compensation and card claims, review attestation and more. They support human review; they don't replace it.",
  },
];

// Rate Family V2: a separate development application, not the live sites.
const V2 = [
  {
    t: "Frontend, backend, shared contracts",
    d: "A Next.js frontend and a NestJS API in one repository, sharing a single package of typed contracts so both sides agree on every payload.",
  },
  {
    t: "Host theming",
    d: "The same four brands, themed per host through a shared design-token contract.",
  },
  {
    t: "Mock data, labelled as mock",
    d: "Quote and card data are deterministic fixtures. Fixture offers carry a development-only source, and in production mode the API client rejects any mock-tier response that is missing its mock flag.",
  },
];

const GATES = [
  "The public education websites and the V2 development app are separate codebases with distinct roles.",
  "V2 quote and card data are mock fixtures, not live offers.",
  "V2 has no purchase or bind endpoint: binding insurance is a regulated act, so the platform stops at the lead.",
  "Measured search and enquiry outcomes will be reported with dates and sources.",
];

const NUMBERS = [
  { n: "4", l: "public education brands" },
  { n: "120+", l: "page routes in one production app" },
  { n: "9", l: "CMS document types" },
  { n: "20+", l: "automated check scripts" },
];

const STACK = ["Next.js", "React", "TypeScript", "Sanity CMS", "IndexNow", "NestJS (V2)"];

const FOR_YOU = [
  {
    t: "Multi-location or multi-brand?",
    d: "The same one-platform approach serves franchises, multi-location trades and holding companies — one codebase to maintain, separate identities for each brand.",
  },
  {
    t: "Trust-sensitive industry?",
    d: "Health, finance, legal, trades: source records and human review belong in the publishing workflow. Automated checks support that review; they do not guarantee accuracy.",
  },
  {
    t: "Small team, big workload?",
    d: "Shared components and contracts can reduce repeated implementation work. Editorial and automation workflows should keep explicit review steps.",
  },
];

export default function RateFamilyCaseStudy() {
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/projects" },
          { name: "The Rate Family", path: "/projects/rate-family" },
        ])}
      />

      <PageHero
        eyebrow="Case study 02 · Built and operated in-house"
        title={
          <>
            The Rate Family: <span className="wh-em">four brands, one codebase.</span>
          </>
        }
        sub="A network of four Canadian insurance and mortgage education sites — built, run and maintained by Webhub4U on a single platform, with distinct brand identities, shared development patterns and an ongoing search programme."
      />

      {/* ---------- CHALLENGE ---------- */}
      <section className={`wh ${styles.light}`}>
        <div className={`wh-inner ${styles.split}`}>
          <div>
            <p className="wh-eyebrow">The challenge</p>
            <h2 className={`wh-display ${styles.h2}`}>
              Four identities, <span className="wh-em">one foundation.</span>
            </h2>
          </div>
          <div className={styles.prose}>
            <p>
              Each brand needed its own look, voice and search identity. Four
              separate websites would have meant four codebases, four content
              systems and four sets of bugs to chase — for a small team.
            </p>
            <p>
              And the subject matter is money and insurance: content where
              accuracy and clear disclosure aren&apos;t optional. The platform
              had to make the careful path the default path.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- WHAT WE BUILT ---------- */}
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">What we built</p>
          <h2 className={`wh-display ${styles.h2}`}>
            A shared platform for <span className="wh-em">four brands.</span>
          </h2>
          <div className={styles.grid2}>
            {BUILT.map((b) => (
              <div key={b.t} className={styles.card}>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`wh ${styles.light}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">SEO work</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Give useful content <span className="wh-em">a clear structure.</span>
          </h2>
          <div className={styles.grid2}>
            <article className={styles.card}>
              <h3>Content architecture</h3>
              <p>The public network groups educational guides by topic and audience, connecting relevant guides, calculators and specialist brands.</p>
            </article>
            <article className={styles.card}>
              <h3>Measurement comes next</h3>
              <p>Search Console impressions, non-brand clicks and qualified enquiries will establish the baseline. This case study does not yet report a ranking or traffic increase.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- V2 (IN DEVELOPMENT) ---------- */}
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">In development · Rate Family V2</p>
          <h2 className={`wh-display ${styles.h2}`}>
            The next version, <span className="wh-em">built on mock data first.</span>
          </h2>
          <div className={styles.prose}>
            <p>
              V2 is a separate application, not the code behind the live
              sites. It runs entirely on deterministic mock data, so the
              integrations can be swapped in later without reshaping the app.
            </p>
          </div>
          <div className={styles.grid3}>
            {V2.map((v) => (
              <div key={v.t} className={styles.card}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT RUNS ---------- */}
      <section className={`wh ${styles.dark}`}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={`wh-inner ${styles.split}`}>
          <div>
            <p className={`wh-eyebrow ${styles.eyebrowInv}`}>How it runs</p>
            <h2 className={`wh-display ${styles.h2Inv}`}>
              Public websites. <span className="wh-em">An evolving product.</span>
            </h2>
            <p className={styles.proseInv}>
              The public education network is live. V2 is a separate
              development application with explicit limits:
            </p>
          </div>
          <ul className={styles.gates}>
            {GATES.map((g) => (
              <li key={g}>
                <span className={styles.gateMark} aria-hidden="true">✓</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- NUMBERS ---------- */}
      <section className={`wh ${styles.light}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">By the numbers</p>
          <div className={styles.numbers}>
            {NUMBERS.map((x) => (
              <div key={x.l} className={styles.num}>
                <strong>{x.n}</strong>
                <span>{x.l}</span>
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Counted from the production codebase on 29 October 2026. Page
            routes are route files, not published URLs: one blog or glossary
            template serves many pages, and some routes serve only one brand.
            Document types are the CMS schemas (six editorial, three for
            enquiries and sign-ups). Check scripts run before changes merge,
            and one of them also runs inside every production build. These
            figures describe the scope of the work; traffic, ranking and
            enquiry outcomes will be added once they are measured and
            shareable.
          </p>
          <div className={styles.stack}>
            {STACK.map((s) => (
              <span key={s} className={styles.chip}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SEE IT LIVE ---------- */}
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">See it live</p>
          <h2 className={`wh-display ${styles.h2}`}>
            Four sites. <span className="wh-em">Go take a look.</span>
          </h2>
          <div className={styles.sites}>
            {SITES.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.site}
              >
                <strong>{s.name}</strong>
                <span>{s.focus}</span>
                <em>Visit site ↗</em>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHAT IT MEANS FOR YOU ---------- */}
      <section className={`wh ${styles.light}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">What this means for your project</p>
          <h2 className={`wh-display ${styles.h2}`}>
            The same engine, <span className="wh-em">pointed at your business.</span>
          </h2>
          <div className={styles.grid3}>
            {FOR_YOU.map((f) => (
              <div key={f.t} className={styles.card}>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
          <div className={styles.ctaRow}>
            <Link href="/services/web-development" className="wh-btn wh-btn--primary">
              Explore web development
            </Link>
            <Link href="/services/seo" className={styles.back}>Explore SEO services ↗</Link>
            <Link href="/projects" className={styles.back}>
              ← All work
            </Link>
          </div>
        </div>
      </section>

      <CtaNew />
    </PageShell>
  );
}
