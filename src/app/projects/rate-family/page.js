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
 * Scope reviewed on 2026-10-20 against public brand sites and the V2 README.
 * Public education sites and mock-data V2 are explicitly distinguished.
 * Add outcome metrics only with a dated, shareable measurement source.
 */

const SITES = [
  { name: "TopRates.ca", href: "https://www.toprates.ca", focus: "The hub — insurance, mortgages and credit cards" },
  { name: "LifeRate.ca", href: "https://www.liferate.ca", focus: "Life and critical illness insurance" },
  { name: "TermRates.ca", href: "https://www.termrates.ca", focus: "Mortgages" },
  { name: "HealthRate.ca", href: "https://www.healthrate.ca", focus: "Health, travel and Super Visa insurance" },
];

const BUILT = [
  {
    t: "One app, four sites",
    d: "The shared V2 codebase supports four brand identities through host-based theming, with separate visual styles and navigation for each brand.",
  },
  {
    t: "Shared contracts, distinct brands",
    d: "The V2 codebase separates its frontend, backend and shared contracts. A shared API client connects each brand to deterministic development data.",
  },
  {
    t: "Search plumbing for a multi-domain network",
    d: "Our search work covers metadata, canonical ownership, sitemaps and links between relevant pages. These foundations need ongoing checks and measurement as the network evolves.",
  },
  {
    t: "Guardrails written as code",
    d: "The V2 development environment explicitly marks quote and card fixtures as mock data. Tests and shared contracts help keep those fixtures distinct from live offers.",
  },
];

const GATES = [
  "The public education websites and V2 development environment have distinct roles.",
  "V2 quote and card data are mock fixtures, not live offers.",
  "The V2 application does not provide a live purchase or bind service.",
  "Measured search and enquiry outcomes will be reported with dates and sources.",
];

const NUMBERS = [
  { n: "4", l: "public education brands" },
  { n: "1", l: "shared V2 codebase" },
];

const STACK = ["Next.js", "React", "TypeScript", "NestJS (V2)", "Shared API contracts"];

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
              systems and four sets of bugs to chase — for a team of one.
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
              The public education network is live. Its V2 application is a
              development environment with explicit limits:
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
            The four public brands and shared V2 codebase describe the scope
            of the work. Traffic, ranking and enquiry outcomes will be added
            once they are measured and shareable.
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
