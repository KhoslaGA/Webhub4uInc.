import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import styles from "@/components/sections/new/CaseStudy.module.css";

export const metadata = {
  title: "Insurimple Platform & BMS: Software Engineering | Webhub4U",
  description: "Explore Insurimple, an owner-operated CRM and insurance operations project in development. Connected workflows, review steps and traceable records using demonstration data.",
  alternates: { canonical: "/projects/insurimple" },
};

const ENGINEERING = [
  { title: "Separate business systems", text: "The operations platform handles CRM, tasks and opportunities. The BMS owns policy, household, renewal and quote records. They integrate through defined API contracts." },
  { title: "Tenant isolation", text: "Development implementation includes organisation-scoped access and database policies, with regression tests for separation between organisations. Production security requires its own operational validation." },
  { title: "Audited changes", text: "Implemented policy workflows record changes and prepare follow-up events together. Source tests cover traceability and protected history; this is engineering evidence, not a claim of production certification." },
  { title: "Controlled automation", text: "Implemented request handling accounts for repeated operations. AI-assisted proposals have a human review step before supported changes can be applied. These controls are demonstrated in development." },
];

export default function InsurimpleCaseStudy() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/projects" }, { name: "Insurimple", path: "/projects/insurimple" }])} />
      <PageHero
        eyebrow="Owned engineering project · In development"
        title={<>Insurimple: software for <span className="wh-em">complex operations.</span></>}
        sub="An insurance operations platform and broker management system. Explore the engineering behind connected workflows, controlled access and traceable business records."
      />
      <section className={`wh ${styles.light}`}>
        <div className={`wh-inner ${styles.split}`}>
          <div><p className="wh-eyebrow">The challenge</p><h2 className={`wh-display ${styles.h2}`}>Connect the workflow. <span className="wh-em">Keep ownership clear.</span></h2></div>
          <div className={styles.prose}><p>Insurance operations connect people, policies, renewals, tasks and decisions. A useful system needs to keep those relationships consistent while making it clear who can read or change each record.</p><p>Insurimple separates the operator experience from the insurance system of record, with explicit contracts between them. This is the kind of systems design behind our custom software work.</p></div>
        </div>
      </section>
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner"><p className="wh-eyebrow">Engineering approach</p><h2 className={`wh-display ${styles.h2}`}>Designed around <span className="wh-em">business rules.</span></h2><div className={styles.grid2}>{ENGINEERING.map(x => <article key={x.title} className={styles.card}><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div>
      </section>
      <section className={`wh ${styles.light}`}>
        <div className={`wh-inner ${styles.split}`}>
          <div><p className="wh-eyebrow">Project status</p><h2 className={`wh-display ${styles.h2}`}>Engineering evidence, <span className="wh-em">with clear boundaries.</span></h2></div>
          <div className={styles.prose}><p>This is an ongoing development project. The documented platform includes CRM workflows and BMS integration. Some modules and live integrations remain in development or depend on external setup.</p><p>The source and tests reviewed on 31 October 2026 include connected CRM and policy workflows. This review did not rerun the private systems’ integration suites or verify a production release. Demonstrations use synthetic data; live integrations and release checks remain separate milestones.</p><p>A technical walkthrough can cover the architecture, implemented workflow and test approach using demonstration data.</p></div>
        </div>
      </section>
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner"><p className="wh-eyebrow">For your business</p><h2 className={`wh-display ${styles.h2}`}>Bring us the <span className="wh-em">hard workflow.</span></h2><div className={styles.prose}><p>If your team works across disconnected tools, approvals or complex records, we can help define the boundaries and build a focused first release. Start with the workflow, the users and the rules the software must enforce.</p></div><div className={styles.ctaRow}><Link href="/services/custom-software-development" className="wh-btn wh-btn--primary">Explore custom software development</Link><Link href="/projects" className={styles.back}>← All work</Link></div></div>
      </section>
      <CtaNew />
    </PageShell>
  );
}
