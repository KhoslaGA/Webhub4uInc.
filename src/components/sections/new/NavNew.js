"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavNew.module.css";

const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Our work", href: "/projects" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
];

const NavNew = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`wh ${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
    >
      <div className={`wh-inner ${styles.bar}`}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <Image
            src="/logo-nav-t.png"
            alt="Webhub4U"
            width={190}
            height={93}
            priority
            className={styles.logoImg}
          />
        </Link>
        <nav id="primary-navigation" aria-label="Main navigation" className={`${styles.links} ${open ? styles.linksOpen : ""}`}>
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`wh-btn wh-btn--primary ${styles.navCta}`}
            onClick={() => setOpen(false)}
          >
            Book a call
          </Link>
        </nav>
        <button
          className={styles.burger}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default NavNew;
