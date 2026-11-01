import Link from "next/link";
import ProjectShowcase from "./ProjectShowcase";
import styles from "./FeaturedWork.module.css";

export default function FeaturedWork() {
  return (
    <section id="selected-work" className={`wh ${styles.wrap}`} aria-labelledby="featured-work-title">
      <div className="wh-inner">
        <div className={styles.header}>
          <div><p className="wh-eyebrow">The Webhub4U portfolio</p><h2 id="featured-work-title" className={`wh-display ${styles.heading}`}>Five projects.<br /><span className="wh-em">One team behind them.</span></h2></div>
          <div className={styles.intro}><p>Four distinct websites. One ambitious software platform. All designed and built in-house.</p><Link className={styles.textLink} href="/projects">Explore the portfolio ↗</Link></div>
        </div>
        <ProjectShowcase />
      </div>
    </section>
  );
}
