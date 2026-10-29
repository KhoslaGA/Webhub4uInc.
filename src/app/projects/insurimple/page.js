import Link from "next/link";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import CtaNew from "@/components/sections/new/CtaNew";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import styles from "@/components/sections/new/CaseStudy.module.css";

export const metadata = {
  title: "Insurimple Platform & BMS: Software Engineering | Webhub4U",
  description: "Explore the Insurimple software project: a CRM and operations platform integrated with an insurance BMS, tenant isolation, audit trails and controlled workflows.",
  alternates: { canonical: "/projects/insurimple" },
};

/*
 * Audited 2026-10-29 against the implementation and tests of
 * KhoslaGA/Insurimple-Platform @ 230a8f5 and KhoslaGA/Insurimpleplatform-backend
 * @ 617a63e (both private). Verdicts and evidence:
 * docs/case-study-audit-2026-10-29.md. Publish only at the level of these
 * claims: no vendors, regions, credential formats or table names.
 */

// Implemented in code and covered by automated tests (not production behaviour).
const ENGINEERING = [
  { title: "Separate business systems", text: "The operations platform handles CRM records, opportunities and a single activity queue. The BMS owns household, policy, renewal and quote records. The platform reaches the BMS only through a typed API client that validates every response." },
  { title: "Tenant isolation", text: "In the BMS, each request's organisation comes from a signature-verified session or a credential bound to one organisation. PostgreSQL row-level security is forced on every tenant-scoped table, and tenant-scoped keys stop a record from referencing another organisation's data." },
  { title: "Audited changes", text: "Policy changes, from bind and endorsement to renewal and cancellation, append to a ledger that cannot be edited or deleted. Each change writes its audit record and outbox event in the same database transaction." },
  { title: "Controlled automation", text: "Every BMS write carries an idempotency key, so a retried request returns the original result instead of repeating the change. AI assistance can read records and propose work, but nothing it proposes executes until a person confirms it." },
];

const STATUS = [
  { title: "Implemented and tested", text: "The four areas above exist in code, each covered by automated tests. Non-production builds show an on-screen data-mode label, such as FIXTURE DATA." },
  { title: "Verified in a sandbox", text: "In a cloud sandbox with synthetic data only, the end-to-end verification run passed on 30 September 2026. It confirms that no database role can bypass row-level security and runs the row-level security tests against the sandbox database." },
  { title: "Not yet in production use", text: "No real customer data and no live customer operations. Real-data intake stays locked until legal and operational prerequisites are met. Live integrations and production operation are the next milestones." },
];

export default function InsurimpleCaseStudy() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/projects" }, { name: "Insurimple", path: "/projects/insurimple" }])} />
      <PageHero
        eyebrow="Engineering case study · Product in development"
        title={<>Insurimple: software for <span className="wh-em">complex operations.</span></>}
        sub="An insurance operations platform and broker management system. Explore the engineering behind connected workflows, controlled access and traceable business records."
      />
      <section className={`wh ${styles.light}`}>
        <div className={`wh-inner ${styles.split}`}>
          <div><p className="wh-eyebrow">The challenge</p><h2 className={`wh-display ${styles.h2}`}>Connect the workflow. <span className="wh-em">Keep ownership clear.</span></h2></div>
          <div className={styles.prose}><p>Insurance operations connect people, policies, renewals, follow-ups and decisions. A useful system needs to keep those relationships consistent while making it clear who can read or change each record.</p><p>Insurimple separates the operator experience from the insurance system of record, with explicit contracts between them. This is the kind of systems design behind our custom software work.</p></div>
        </div>
      </section>
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner"><p className="wh-eyebrow">Engineering approach</p><h2 className={`wh-display ${styles.h2}`}>Designed around <span className="wh-em">business rules.</span></h2><div className={styles.grid2}>{ENGINEERING.map(x => <article key={x.title} className={styles.card}><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div>
      </section>
      <section className={`wh ${styles.light}`}>
        <div className={`wh-inner ${styles.split}`}>
          <div><p className="wh-eyebrow">Project status · Audited 29 October 2026</p><h2 className={`wh-display ${styles.h2}`}>Engineering evidence, <span className="wh-em">with clear boundaries.</span></h2></div>
          <div className={styles.prose}><p>This is an ongoing development project. Here is what exists in code, what has been verified and what is still ahead.</p><p>A technical walkthrough can cover the architecture, implemented workflow and test approach using demonstration data.</p></div>
        </div>
        <div className="wh-inner"><div className={styles.grid3}>{STATUS.map(x => <article key={x.title} className={styles.card}><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div>
      </section>
      <section className={`wh ${styles.soft}`}>
        <div className="wh-inner"><p className="wh-eyebrow">For your business</p><h2 className={`wh-display ${styles.h2}`}>Bring us the <span className="wh-em">hard workflow.</span></h2><div className={styles.prose}><p>If your team works across disconnected tools, approvals or complex records, we can help define the boundaries and build a focused first release. Start with the workflow, the users and the rules the software must enforce.</p></div><div className={styles.ctaRow}><Link href="/services/custom-software-development" className="wh-btn wh-btn--primary">Explore custom software development</Link><Link href="/projects" className={styles.back}>← All work</Link></div></div>
      </section>
      <CtaNew />
    </PageShell>
  );
}
