import Link from "next/link";
import Image from "next/image";
import PhoneLink from "./PhoneLink";
import { LOCATIONS } from "@/data/locations";
import styles from "./FooterNew.module.css";

const FooterNew = () => (
  <footer className={`wh ${styles.wrap}`}>
    <div className="wh-inner">
      <div className={styles.top}>
        <div className={styles.brand}>
          <Image
            src="/logo-nav-t.png"
            alt="Webhub4U"
            width={190}
            height={93}
            className={styles.logoImg}
          />
          <p className={styles.blurb}>
            Web development, SEO and custom software for businesses across
            the Greater Toronto Area. Based in Brampton, Ontario.
          </p>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Services</p>
          <Link href="/services/web-development">Web development</Link>
          <Link href="/services/custom-software-development">Custom software</Link>
          <Link href="/ai-receptionist">AI receptionist</Link>
          <Link href="/missed-call-text-back">Missed-call text-back</Link>
          <Link href="/#ai">AI chatbots</Link>
          <Link href="/services/seo">SEO &amp; local search</Link>
          <Link href="/#pricing">Pricing</Link>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Company</p>
          <Link href="/about">About</Link>
          <Link href="/projects">Work</Link>
          <Link href="/guarantee">Guarantee</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy-policy">Privacy</Link>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Get in touch</p>
          <PhoneLink source="footer" />
          <a href="mailto:webhub4u@gmail.com">webhub4u@gmail.com</a>
          <Link href="/contact">Book a free consult</Link>
        </div>
      </div>
      <div className={styles.cities}>
        <p className={styles.colTitle}>
          <Link href="/locations" className={styles.citiesTitleLink}>
            Areas we serve
          </Link>
        </p>
        <p className={styles.cityList}>
          {LOCATIONS.map((c, i) => (
            <span key={c.slug}>
              {i > 0 ? " · " : ""}
              <Link href={`/locations/${c.slug}`}>{c.name}</Link>
            </span>
          ))}
        </p>
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Webhub4U Inc. All rights reserved.
        </p>
        <p>Made in Brampton, Ontario 🇨🇦</p>
      </div>
    </div>
  </footer>
);

export default FooterNew;
