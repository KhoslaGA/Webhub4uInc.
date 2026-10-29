"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoGlobe from "./LogoGlobe";
import styles from "./HeroNew.module.css";

const HeroNew = ({ services }) => {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const globeRef = useRef(null);

  // Scroll choreography: pin the hero briefly and parallax its layers at
  // different depths while the canvas camera dives through the particle field.
  // Skipped entirely for reduced-motion users (native scroll, no pin).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=85%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => globeRef.current?.setScroll(self.progress),
        },
      });

      // Depth layers, slowest (deepest) → fastest (closest):
      // background sinks & dims as the camera pushes past it…
      tl.to(bgRef.current, { yPercent: 12, opacity: 0.3, ease: "none" }, 0);
      // …the service panel recedes into the mid-ground…
      tl.to(
        rightColRef.current,
        { yPercent: -18, scale: 0.94, opacity: 0.1, ease: "none" },
        0
      );
      // …and the headline lifts away in the foreground, moving most.
      tl.to(
        leftColRef.current,
        { yPercent: -46, opacity: 0, ease: "none" },
        0
      );
    }, heroRef);

    // Fonts (Fraunces) can reflow the hero after mount — recompute positions.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, []);

  return (
    <section className={`wh ${styles.hero}`} ref={heroRef}>
      <div className={styles.bg} ref={bgRef} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.grid} />
        <div className={styles.noise} />
      </div>
      <div className={styles.globeLayer} aria-hidden="true">
        <LogoGlobe ref={globeRef} variant="hero" />
      </div>
      <div className={`wh-inner ${styles.inner}`}>
        <div className={styles.leftCol} ref={leftColRef}>
        <div
          className={styles.left}
        >
          <p className={`wh-eyebrow ${styles.eyebrow}`}>
            Web development · SEO · Custom software
          </p>
          <h1 className={`wh-display ${styles.title}`}>
            Built to work.
            <span className="wh-em"> Made to grow.</span>
          </h1>
          <p className={styles.sub}>
            Websites your customers can use. Search content they can find.
            Software that helps your team get work done. Based in Brampton,
            serving Toronto and the GTA.
          </p>
          <div className={styles.ctas}>
            <Link href="/contact" className="wh-btn wh-btn--primary">
              Discuss your project
            </Link>
            <Link href="/projects" className="wh-btn wh-btn--ghost-dark">
              Explore our work
            </Link>
          </div>
          <ul className={styles.pillars}>
            <li>Design &amp; development</li>
            <li>Search &amp; content</li>
            <li>Business workflows</li>
          </ul>
        </div>
        </div>
        <div className={styles.rightCol} ref={rightColRef}>
        <div className={styles.right}>
          <div className={styles.servicePanel}>
            <p className={styles.panelLabel}>Start with what needs to work better</p>
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className={styles.serviceRow}>
                <span><strong>{service.name}</strong><span>{service.question}</span></span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <p className={styles.panelNote}>Explore the approach, scope and relevant work.</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
