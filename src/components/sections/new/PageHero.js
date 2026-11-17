import ConstellationBg from "./ConstellationBg";
import styles from "./PageHero.module.css";

/** `children` (optional) renders below the sub — e.g. a CTA row. */
const PageHero = ({ eyebrow, title, sub, children }) => (
  <section className={`wh ${styles.hero}`}>
    <ConstellationBg />
    <div className={styles.glow} aria-hidden="true" />
    <div className={`wh-inner ${styles.inner}`}>
      {eyebrow && <p className={`wh-eyebrow ${styles.eyebrow}`}>{eyebrow}</p>}
      <h1 className={`wh-display ${styles.title}`}>{title}</h1>
      {sub && <p className={styles.sub}>{sub}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
