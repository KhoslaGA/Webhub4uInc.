"use client";
import { useRef } from "react";
import { SplitHeading, RevealText, useStagger } from "./homeMotion";
import styles from "./ProcessNew.module.css";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    desc: "A 20-minute call about your business, your customers, and what a win looks like. Free, no pressure.",
  },
  {
    n: "02",
    title: "Design & build",
    desc: "We design, write, and build your site — you review a live preview link and tell us what to change.",
  },
  {
    n: "03",
    title: "Launch",
    desc: "We check the agreed journeys, content and integrations before launch. Timing is confirmed after scope, content and dependencies are agreed.",
  },
  {
    n: "04",
    title: "Grow",
    desc: "Care plans, local SEO, and AI tools keep the site earning. We stay accountable to results, not just launches.",
  },
];

const ProcessNew = () => {
  const stepsRef = useRef(null);
  useStagger(stepsRef, { stagger: 0.09 });
  return (
    <section className={`wh ${styles.wrap}`} id="process">
      <div className="wh-inner">
        <RevealText as="p" className="wh-eyebrow">How it works</RevealText>
        <SplitHeading className={`wh-display ${styles.heading}`} delay={80}>
          From first conversation to <span className="wh-em">working release.</span>
        </SplitHeading>
        <div className={styles.steps} ref={stepsRef}>
          {STEPS.map((s) => (
            <div key={s.n} className={styles.step}>
              <span className={styles.num}>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessNew;
