"use client";
import { useRef } from "react";
import Link from "next/link";
import useTilt from "./useTilt";
import { SplitHeading, RevealText, useStagger } from "./homeMotion";
import styles from "./AIShowcaseNew.module.css";

const ITEMS = [
  { stat: "After-hours enquiries", title: "AI Receptionist", desc: "Explore after-hours enquiry handling and follow-up options, scoped to your tools and workflow." },
  { stat: "24/7 on your website", title: "AI Chat Assistant", desc: "Trained on your services, pricing, and service area. It answers the questions visitors actually ask and turns them into booked leads while you sleep." },
  { stat: "Hours back every week", title: "Workflow Automation", desc: "Quotes, invoices, review requests, and follow-ups that send themselves. We wire your tools together so the busywork runs without you." },
];

const AIShowcaseNew = () => {
  const cardsRef = useRef(null);
  useTilt(cardsRef, `.${styles.card}`);
  useStagger(cardsRef);
  return (
    <section className={`wh ${styles.wrap}`} id="ai">
      <div className="wh-inner">
        <RevealText as="p" className={`wh-eyebrow ${styles.eyebrow}`}>The AI advantage</RevealText>
        <SplitHeading className={`wh-display ${styles.heading}`} delay={80}>
          Your website is step one.{" "}
          <span className="wh-em">AI makes it work overtime.</span>
        </SplitHeading>
        <RevealText as="p" className={styles.lede} delay={140}>
          We build AI tools on the same technology powering the world&apos;s
          leading assistants — set up for your business, your services, and your
          customers. No hype, no black box: practical tools that answer, book,
          and follow up.
        </RevealText>
        <div className={styles.cards} ref={cardsRef}>
          {ITEMS.map((it) => (
            <div key={it.title} className={styles.card}>
              <span className={styles.stat}>{it.stat}</span>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
        <RevealText as="div" className={styles.ctaRow}>
          <Link href="/contact" className="wh-btn wh-btn--primary">See a live demo</Link>
          <span className={styles.ctaNote}>We&apos;ll show you an AI receptionist answering a real call.</span>
        </RevealText>
      </div>
    </section>
  );
};

export default AIShowcaseNew;
