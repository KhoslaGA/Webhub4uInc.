import Link from "next/link";
import LogoGlobe from "./LogoGlobe";
import { SplitHeading, RevealText } from "./homeMotion";
import styles from "./CtaNew.module.css";

const CtaNew = () => (
  <section className={`wh ${styles.wrap}`}>
    <div className={`wh-inner ${styles.inner}`}>
      <div className={styles.globeWrap}>
        <LogoGlobe size={420} />
      </div>
      <SplitHeading className={`wh-display ${styles.heading}`}>
        Ready to look like the{" "}
        <span className="wh-em">business you actually are?</span>
      </SplitHeading>
      <RevealText as="p" className={styles.sub} delay={120}>
        Request a free introductory call. We&apos;ll look at your current online
        presence together and tell you exactly what we&apos;d do — even if you
        don&apos;t hire us.
      </RevealText>
      <RevealText as="div" className={styles.ctas} delay={200}>
        <Link href="/contact" className="wh-btn wh-btn--primary">
          Discuss your project
        </Link>
        <a href="mailto:webhub4u@gmail.com" className="wh-btn wh-btn--ghost-dark">
          webhub4u@gmail.com
        </a>
      </RevealText>
    </div>
  </section>
);

export default CtaNew;
