import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import ServicesNew from "@/components/sections/new/ServicesNew";
import styles from "@/components/sections/new/ServicesPage.module.css";

export const metadata = {
  alternates: { canonical: "/services" },
  title: "Web Development, SEO & Custom Software | Webhub4U",
  description: "Explore Webhub4U's web development, SEO and custom software services for Toronto and GTA businesses. Start with your website, customers or business workflow.",
};

export default function Services() {
  return (
    <PageShell>
      <PageHero eyebrow="Services · Toronto & GTA" title={<>Start with what needs to <span className="wh-em">work better.</span></>} sub="A clearer website, useful search content or a tool for your team. Choose the problem you want to solve, and explore how we can help." />
      <ServicesNew />
      <section className={`wh ${styles.wrap}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">Connected tools</p>
          <h2 className={`wh-display ${styles.heading}`}>Support the work <span className="wh-em">around your website.</span></h2>
          <div className={styles.items}>
            <article className={styles.item}><h3>AI receptionist</h3><p>Explore call-handling and appointment workflows, with business information and handoff rules reviewed before launch.</p><Link href="/ai-receptionist">Explore AI receptionists ↗</Link></article>
            <article className={styles.item}><h3>Missed-call text-back</h3><p>Connect missed calls with a follow-up message and a clear next step for the customer and your team.</p><Link href="/missed-call-text-back">Explore text-back workflows ↗</Link></article>
            <article className={styles.item}><h3>Website packages and support</h3><p>Review standard website packages. Custom software, complex integrations and migrations receive a separate scope.</p><Link href="/#pricing">View website packages ↗</Link></article>
          </div>
          <div className={styles.brief}><h2>Bring us a useful starting point.</h2><p>Your current website, one customer question or one process your team repeats. We’ll discuss the users, tools, content and dependencies before agreeing the work.</p><Link href="/contact" className="wh-btn wh-btn--primary">Discuss your project</Link></div>
        </div>
      </section>
    </PageShell>
  );
}
