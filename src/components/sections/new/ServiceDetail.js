import Link from "next/link";
import PageShell from "./PageShell";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, serviceLd } from "@/lib/schema";
import { SERVICE_PAGES, servicePath } from "@/data/servicePages";
import styles from "./ServiceDetail.module.css";

export default function ServiceDetail({ service }) {
  const contact = `/contact?service=${service.slug}`;
  return (
    <PageShell>
      <JsonLd data={serviceLd(service)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name, path: servicePath(service) }])} />
      <section className={`wh ${styles.hero}`}>
        <div className="wh-inner">
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/services">Services</Link><span aria-hidden="true">/</span><span>{service.name}</span></nav>
          <div className={styles.heroGrid}>
            <div>
              <p className="wh-eyebrow">{service.label} · Toronto &amp; GTA</p>
              <h1 className={`wh-display ${styles.title}`}>{service.headline} <span className="wh-em">{service.accent}</span></h1>
              <p className={styles.intro}>{service.intro}</p>
              <Link className="wh-btn wh-btn--primary" href={contact}>Discuss your project <span aria-hidden="true">↗</span></Link>
            </div>
            <aside className={styles.flow} aria-label={service.flowLabel}>
              <p className={styles.caption}>{service.flowLabel}</p>
              <ol>{service.flow.map((step, i) => <li key={step}><span className={styles.number} aria-hidden="true">0{i + 1}</span><span>{step}</span></li>)}</ol>
              <p className={styles.fit}>{service.fit}</p>
            </aside>
          </div>
        </div>
      </section>
      <section className={`wh ${styles.section}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">What we can help with</p>
          <h2 className={`wh-display ${styles.heading}`}>A practical scope. <span className="wh-em">Clear deliverables.</span></h2>
          <div className={styles.deliverables}>{service.deliverables.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </section>
      <section className={`wh ${styles.soft}`}>
        <div className={`wh-inner ${styles.project}`}>
          <div><p className="wh-eyebrow">Relevant work</p><h2 className={`wh-display ${styles.heading}`}>{service.project.name}</h2><p className={styles.status}>{service.project.status}</p></div>
          <div><p>{service.project.text}</p><Link className={styles.link} href={service.project.href}>Explore the {service.project.name} case study <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
      <section className={`wh ${styles.section}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">How we work</p><h2 className={`wh-display ${styles.heading}`}>From the first question <span className="wh-em">to a useful release.</span></h2>
          <div className={styles.steps}>{service.steps.map((step, i) => <article key={step.title}><span className={styles.stepNumber} aria-hidden="true">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
          <div className={styles.measure}><h3>Agree what success means</h3><p>{service.measure}</p></div>
        </div>
      </section>
      <section className={`wh ${styles.soft}`}>
        <div className={`wh-inner ${styles.project}`}>
          <div><p className="wh-eyebrow">Before we start</p><h2 className={`wh-display ${styles.heading}`}>Questions <span className="wh-em">worth asking.</span></h2></div>
          <div className={styles.faq}>{service.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div>
        </div>
      </section>
      <section className={`wh ${styles.section}`}>
        <div className="wh-inner">
          <p className="wh-eyebrow">Connected services</p>
          <div className={styles.related}>{SERVICE_PAGES.filter((item) => item.slug !== service.slug).map((item) => <Link key={item.slug} href={servicePath(item)}><strong>{item.name} <span aria-hidden="true">↗</span></strong><span>{item.short}</span></Link>)}</div>
        </div>
      </section>
      <section className={`wh ${styles.cta}`}>
        <div className="wh-inner"><p className="wh-eyebrow">Start with your business</p><h2 className={`wh-display ${styles.heading}`}>Tell us what <span className="wh-em">needs to work better.</span></h2><p>Bring your current website or one workflow you want to improve. We’ll help define the next useful step.</p><Link href={contact} className="wh-btn wh-btn--primary">Discuss {service.slug === "seo" ? "SEO" : service.name.toLowerCase()} <span aria-hidden="true">↗</span></Link></div>
      </section>
    </PageShell>
  );
}
