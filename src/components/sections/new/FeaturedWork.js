import Link from "next/link";
import ProjectShowcase from "./ProjectShowcase";
import styles from "./FeaturedWork.module.css";

export default function FeaturedWork() {
  return (
    <section id="selected-work" className={`wh ${styles.wrap}`} aria-labelledby="featured-work-title">
      <div className="wh-inner">
        <div className={styles.header}>
          <div><p className="wh-eyebrow">The Webhub4U portfolio</p><h2 id="featured-work-title" className={`wh-display ${styles.heading}`}>Ambitious projects.<br /><span className="wh-em">Built in-house.</span></h2></div>
          <div className={styles.intro}><p>A four-brand finance network. Software for complex insurance operations. Explore the design, development and systems thinking behind our own products.</p><Link className={styles.textLink} href="/projects">Explore the full portfolio ↗</Link></div>
        </div>
        <ProjectShowcase />
        <div className={styles.footer}><p>Your business has its own challenges.<br /><strong>Let&apos;s build something worth showing.</strong></p><Link href="/contact" className="wh-btn wh-btn--primary">Discuss your project ↗</Link></div>
      </div>
    </section>
  );
}
