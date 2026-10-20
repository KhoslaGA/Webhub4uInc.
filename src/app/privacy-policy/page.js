import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import styles from "@/components/sections/new/LegalPage.module.css";

export const metadata = {
  alternates: { canonical: "/privacy-policy" },
  title: "Privacy Policy | Webhub4U",
  description: "How Webhub4U collects, uses, and protects your information.",
};

export default function Privacy() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className={`wh ${styles.wrap}`}>
        <div className={`wh-inner ${styles.body}`}>
          <p className={styles.updated}>Last updated: {new Date().getFullYear()}</p>
          <h2>Who we are</h2>
          <p>Webhub4U Inc. (&quot;we&quot;, &quot;us&quot;) is a digital agency based in Brampton, Ontario, Canada. This policy explains how we handle information you share with us through this website.</p>
          <h2>What we collect</h2>
          <p>When you submit our contact form, we collect the details you provide — such as your name, business name, email, phone number, and message. We use this solely to respond to your enquiry and discuss working together.</p>
          <h2>How we use it</h2>
          <p>We use your information to reply to you, provide quotes, and deliver services you request. We do not sell your information, and we do not add you to marketing lists without your consent, in line with Canada&apos;s Anti-Spam Legislation (CASL).</p>
          <h2>Data storage</h2>
          <p>Form submissions are delivered to us by email and stored only as long as needed to serve you. Our website is hosted on secure infrastructure with encryption in transit.</p>
          <h2>Your rights</h2>
          <p>Under PIPEDA, you may request access to, correction of, or deletion of the personal information we hold about you. Email us to make a request.</p>
          <h2>Contact</h2>
          <p>Questions about this policy? Email <a href="mailto:webhub4u@gmail.com">webhub4u@gmail.com</a>.</p>
        </div>
      </section>
    </PageShell>
  );
}
