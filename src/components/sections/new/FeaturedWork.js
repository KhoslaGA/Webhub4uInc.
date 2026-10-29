import Link from "next/link";
import styles from "./FeaturedWork.module.css";

export default function FeaturedWork() {
  return (
    <section className={`wh ${styles.wrap}`} aria-labelledby="featured-work-title">
      <div className="wh-inner">
        <div className={styles.header}><div><p className="wh-eyebrow">Selected work · Our own products</p><h2 id="featured-work-title" className={`wh-display ${styles.heading}`}>The thinking. <span className="wh-em">The work.</span></h2></div><Link className={styles.textLink} href="/projects">Explore all work ↗</Link></div>
        <div className={styles.grid}>
          <article className={styles.card}>
            <div className={styles.family}>
              <p className={styles.visualLabel}>RateFamily / Brand network</p>
              <div className={styles.brands}><span>TopRates<span>.ca</span></span><span>LifeRate<span>.ca</span></span><span>TermRates<span>.ca</span></span><span>HealthRate<span>.ca</span></span></div>
              <p className={styles.visualNote}>Four identities. Shared development patterns.</p>
            </div>
            <div className={styles.body}><p className={styles.status}>Owned project · Public websites + ongoing development</p><h3>RateFamily</h3><p>Content-rich websites with distinct audiences, connected navigation and a technical SEO foundation.</p><Link className={styles.textLink} href="/projects/rate-family">Explore the development &amp; SEO work ↗</Link></div>
          </article>
          <article className={styles.card}>
            <div className={styles.software}>
              <p className={styles.visualLabel}>Insurimple / Workflow concept</p>
              <div className={styles.workflow}><span>Records</span><span aria-hidden="true">→</span><span>Tasks</span><span aria-hidden="true">→</span><span>Review</span></div>
              <p className={styles.visualNote}>Illustrative process · Product in development</p>
            </div>
            <div className={styles.body}><p className={styles.status}>Owned engineering project · In development</p><h3>Insurimple</h3><p>An insurance operations platform and broker management system built around complex business workflows.</p><Link className={styles.textLink} href="/projects/insurimple">Explore the software engineering work ↗</Link></div>
          </article>
        </div>
      </div>
    </section>
  );
}
