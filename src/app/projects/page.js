import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import Link from "next/link";
import styles from "@/components/sections/new/WorkPage.module.css";

export const metadata = {
  title: "Our Work | Webhub4U — GTA Web Design & AI Projects",
  description:
    "A look at the websites and AI tools Webhub4U builds for businesses across the Greater Toronto Area.",
};

export default function Projects() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our work"
        title={<>Proof over <span className="wh-em">promises.</span></>}
        sub="We're early and we'd rather show real work than fake logos. Here's where our portfolio stands — honestly."
      />
      <section className={`wh ${styles.wrap}`}>
        <div className="wh-inner">
          <div className={styles.featured}>
            <span className={styles.tag}>Case study 01</span>
            <h2 className={`wh-display ${styles.featTitle}`}>
              Webhub4U.com — this website
            </h2>
            <p className={styles.featText}>
              Our own site is our first case study. Custom-built on Next.js,
              designed for speed and search, with the same AI tooling we offer
              clients. Every claim on it is real — no placeholder stats, no
              stock testimonials. If you like what you&apos;re looking at, this
              is the standard we build to.
            </p>
            <div className={styles.featStats}>
              <div><strong>Next.js</strong><span>Custom stack</span></div>
              <div><strong>90+</strong><span>Performance target</span></div>
              <div><strong>AI-native</strong><span>Built-in tooling</span></div>
            </div>
          </div>
          <Link href="/projects/rate-family" className={styles.second}>
            <span className={styles.tag}>Case study 02</span>
            <h2 className={`wh-display ${styles.secondTitle}`}>
              The Rate Family — four brands, one codebase
            </h2>
            <p className={styles.secondText}>
              Four Canadian insurance and mortgage education sites we built and
              run on a single Next.js + Sanity platform, with AI agents doing
              the routine work and a person approving everything that ships.
            </p>
            <span className={styles.secondCta}>Read the case study →</span>
          </Link>
          <div className={styles.soon}>
            <h3>Client case studies — coming soon</h3>
            <p>
              We&apos;re onboarding our first cohort of GTA clients now. As
              projects launch, real case studies with real results will land
              here — challenge, approach, and measurable outcome. Want to be
              one of the first?
            </p>
            <Link href="/contact" className="wh-btn wh-btn--primary">
              Start a project
            </Link>
          </div>
        </div>
      </section>
      <CtaNew />
    </PageShell>
  );
}
