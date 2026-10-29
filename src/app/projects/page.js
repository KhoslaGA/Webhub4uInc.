import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import Link from "next/link";
import styles from "@/components/sections/new/WorkPage.module.css";

export const metadata = {
  alternates: { canonical: "/projects" },
  title: "Web Development, SEO & Software Portfolio | Webhub4U",
  description:
    "Explore RateFamily's web development and SEO foundations, and the Insurimple Platform and BMS software engineering project. Built by Webhub4U in the GTA.",
};

export default function Projects() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our work"
        title={<>Proof over <span className="wh-em">promises.</span></>}
        sub="Explore our own products and platforms: the decisions behind the build, the work delivered and what comes next."
      />
      <section className={`wh ${styles.wrap}`}>
        <div className="wh-inner">
          <div className={styles.featured}>
            <span className={styles.tag}>Owned platform · Web development & SEO</span>
            <h2 className={`wh-display ${styles.featTitle}`}>
              RateFamily — four brands, one platform
            </h2>
            <p className={styles.featText}>
              Four Canadian finance and insurance brands, a shared web platform
              and distinct paths through educational content. Explore the
              development approach and the search foundations behind the network.
            </p>
            <Link href="/projects/rate-family" className="wh-btn wh-btn--primary">Explore RateFamily</Link>
          </div>
          <Link href="/projects/insurimple" className={styles.second}>
            <span className={styles.tag}>Product in development · Custom software</span>
            <h2 className={`wh-display ${styles.secondTitle}`}>
              Insurimple Platform & BMS
            </h2>
            <p className={styles.secondText}>
              Insurance operations software with separate platform and policy
              systems. Explore tenant isolation, audited workflows and the
              integration boundaries behind a complex business application.
            </p>
            <span className={styles.secondCta}>Explore the engineering →</span>
          </Link>
          <div className={styles.soon}>
            <h3>Have a project with similar challenges?</h3>
            <p>
              Tell us what your business needs to make possible. We can help
              scope the website, search strategy or software behind it.
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
