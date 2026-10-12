import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import styles from "@/components/sections/new/CaseStudy.module.css";

export const metadata = {
  title: "Rate Family Case Study: 4 Sites, 1 Codebase | Webhub4U",
  description:
    "How Webhub4U built and runs four Canadian insurance and mortgage education sites on one Next.js + Sanity platform, with AI agents and human sign-off gates.",
  alternates: { canonical: "/projects/rate-family" },
};

/*
 * Every figure on this page is a STRUCTURAL fact taken from the Rate Family
 * repository (site config, CMS schema, scripts, CLAUDE.md) — not traffic,
 * revenue or ranking claims. Add outcome metrics only once they're measured
 * and shareable, with the source and date.
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
    d: "Middleware reads the incoming domain and resolves which brand to serve. Each site gets its own design system, fonts and navigation — all from a single Next.js codebase.",
  },
  {
    t: "One CMS, separate brands",
    d: "A shared Sanity content model — posts, glossary terms, city pages, research briefings, authors and more — with every document scoped to the site it belongs to.",
  },
  {
    t: "Search plumbing for a multi-domain network",
    d: "A canonical ownership map so the four domains never compete as duplicates, per-site sitemaps, and an IndexNow ping to Bing on every production deploy.",
  },
  {
    t: "Guardrails written as code",
    d: "Automated checks scan the codebase and content for unsupported claims, compensation-claim wording, canonical conflicts, wrong-host sitemap entries and stray noindex tags.",
  },
];

const GATES = [
  "Nothing publishes without a person signing off on that specific document — agent edits land as drafts.",
  "Expert-review signatures on financial content are human-only. Agents never set them.",
  "Every link is checked against a live target before it ships.",
  "CMS schema changes deploy only through the command line, on the operator's timing.",
  "No invented figures, dates or sources — a number needs a named, dated source.",
];

const NUMBERS = [
  { n: "4", l: "brand sites" },
  { n: "1", l: "shared codebase" },
  { n: "120+", l: "page routes" },
  { n: "9", l: "CMS content types" },
  { n: "20", l: "automated content & code checks" },
];

const STACK = ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS v4", "Sanity CMS", "Vercel"];

const FOR_YOU = [
  {
    t: "Multi-location or multi-brand?",
    d: "The same one-platform approach serves franchises, multi-location trades and holding companies — one codebase to maintain, separate identities for each brand.",
  },
  {
    t: "Trust-sensitive industry?",
    d: "Health, finance, legal, trades: the guardrails-as-code pattern catches risky claims before they go live, not after a complaint.",
  },
  {
    t: "Small team, big workload?",
    d: "AI agents handle the repetitive work; a person reviews and approves everything that ships. More output without giving up control.",
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
        sub="A network of four Canadian insurance and mortgage education sites — built, run and maintained by Webhub4U on a single platform, with AI agents doing the routine work and a person signing off on everything that ships."
      />

      {/* ---------- CHALLENGE ---------- */}
      <section className={`wh ${styles.light}`}>
        <div className={`wh-inner ${styles.split}`}>
          <div>
            <p className="wh-eyebrow">The challenge</p>
            <h2 className={`wh-display ${styles.h2}`}>
              Four identities, <span className="wh-em">zero duplication.</span>
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
            A platform, <span className="wh-em">not four websites.</span>
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

      {/* ---------- HOW IT RUNS ---------- */}
      <section className={`wh ${styles.dark}`}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={`wh-inner ${styles.split}`}>
          <div>
            <p className={`wh-eyebrow ${styles.eyebrowInv}`}>How it runs</p>
            <h2 className={`wh-display ${styles.h2Inv}`}>
              AI agents do the work. <span className="wh-em">A person approves it.</span>
            </h2>
            <p className={styles.proseInv}>
              Nightly AI agents work the network under a written rulebook that
              lives in the repository itself. These are the rules that keep it
              safe:
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
            Structural facts from the codebase — not vanity metrics. Traffic
            and conversion results will be added here once they&apos;re
            measured and shareable.
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
            <Link href="/contact" className="wh-btn wh-btn--primary">
              Start a project
            </Link>
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
