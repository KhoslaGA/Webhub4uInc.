import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import ProjectShowcase from "@/components/sections/new/ProjectShowcase";
import Link from "next/link";
import styles from "@/components/sections/new/WorkPage.module.css";

export const metadata = {
  alternates: { canonical: "/projects" },
  title: "Web Development, SEO & Software Portfolio | Webhub4U",
  description: "Explore Webhub4U's portfolio: the four-brand RateFamily web network and Insurimple insurance operations software, with actual product captures and case studies.",
};

export default function Projects() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Webhub4U portfolio · Built and owned in-house"
        title={<>Big ideas. <span className="wh-em">Built into real products.</span></>}
        sub="A Canadian finance network spanning four brands. An insurance operations platform built around complex workflows. Get a closer look at the websites, interfaces and engineering behind our work."
      />
      <section className={`wh ${styles.wrap}`}>
        <div className="wh-inner">
          <div className={styles.intro}><div><p className="wh-eyebrow">Five projects · One team</p><h2 className="wh-display">The whole portfolio.<br /><span className="wh-em">All in one place.</span></h2></div><p>Explore each brand below, visit the public websites, or open a case study for the design and engineering behind the product.</p></div>
          <ProjectShowcase />
        </div>
      </section>
      <section className={`wh ${styles.disciplines}`}>
        <div className="wh-inner"><p className="wh-eyebrow">What we bring to your project</p><h2 className="wh-display">The craft behind <span className="wh-em">the finished screen.</span></h2>
          <div className={styles.grid}>
            <article><span aria-hidden="true">01</span><h3>Design that makes the next step clear</h3><p>Brand identity, content structure and responsive interfaces work together to help people find their way and act with confidence.</p><Link href="/services/web-development">Explore web development ↗</Link></article>
            <article><span aria-hidden="true">02</span><h3>Search foundations built into the website</h3><p>Useful content needs a clear home. We connect topics, navigation, metadata and canonical ownership as part of the build.</p><Link href="/services/seo">Explore SEO ↗</Link></article>
            <article><span aria-hidden="true">03</span><h3>Software shaped around the real workflow</h3><p>We map users, records, decisions and integrations, then turn those requirements into a focused product with explicit business rules.</p><Link href="/services/custom-software-development">Explore custom software ↗</Link></article>
          </div>
        </div>
      </section>
      <CtaNew />
    </PageShell>
  );
}
