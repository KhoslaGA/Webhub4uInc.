import Link from "next/link";
import LogoGlobe from "./LogoGlobe";
import PhoneLink from "./PhoneLink";
import styles from "./CtaNew.module.css";

const CtaNew = () => (
  <section className={`wh ${styles.wrap}`} aria-labelledby="next-step-title">
    <div className={`wh-inner ${styles.inner}`}>
      <div className={styles.content}>
        <p className={`wh-eyebrow ${styles.eyebrow}`}>Your next step</p>
        <h2 id="next-step-title" className={`wh-display ${styles.heading}`}>Have a project in mind?<br /><span className="wh-em">Let&apos;s make a plan.</span></h2>
        <p className={styles.sub}>Tell us what you want to build or improve. We&apos;ll review the scope and suggest a practical next step.</p>
        <div className={styles.ctas}>
          <Link href="/contact#project-enquiry" className="wh-btn wh-btn--primary">Start your project <span aria-hidden="true">↗</span></Link>
          <PhoneLink source="closing-cta" className={styles.phone}>Prefer a conversation? Call us ↗</PhoneLink>
        </div>
        <p className={styles.note}>No commitment. A short brief is enough to start.</p>
      </div>
      <div className={styles.globeWrap} aria-hidden="true"><LogoGlobe size={320} /></div>
    </div>
  </section>
);

export default CtaNew;
