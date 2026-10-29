import Link from "next/link";
import { SERVICE_PAGES, servicePath } from "@/data/servicePages";
import styles from "./ServicesNew.module.css";

export default function ServicesNew() {
  return (
    <section className={`wh ${styles.wrap}`} id="services">
      <div className="wh-inner">
        <p className="wh-eyebrow">What we do</p>
        <h2 className={`wh-display ${styles.heading}`}>Three ways to move your <span className="wh-em">business forward.</span></h2>
        <div className={styles.grid}>
          {SERVICE_PAGES.map((service) => (
            <article key={service.slug} className={styles.card}>
              <span className={styles.tag}>{service.label}</span>
              <h3><Link href={servicePath(service)}>{service.name}</Link></h3>
              <p>{service.short}</p>
              <Link className={styles.detailLink} href={servicePath(service)}>Explore {service.slug === "seo" ? "SEO" : service.name.toLowerCase()} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
        <div className={styles.foot}>
          <p>Start with one customer question or one process to improve.</p>
          <Link href="/contact" className="wh-btn wh-btn--primary">Discuss your project</Link>
        </div>
      </div>
    </section>
  );
}
