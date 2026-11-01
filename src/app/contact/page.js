import { Suspense } from "react";
import ContactFormFromUrl from "@/components/sections/new/ContactFormFromUrl";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import ContactForm from "@/components/sections/new/ContactForm";
import PhoneLink from "@/components/sections/new/PhoneLink";
import BookingEmbed from "@/components/sections/new/BookingEmbed";
import styles from "@/components/sections/new/ContactPage.module.css";

export const metadata = {
  alternates: { canonical: "/contact" },
  title: "Discuss Your Project | Webhub4U — Toronto & GTA",
  description:
    "Discuss your project with Webhub4U. Web development, SEO and custom software for businesses across Brampton, Mississauga, Toronto, and the GTA.",
};

export default function Contact() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s build something that{" "}
            <span className="wh-em">works.</span>
          </>
        }
        sub="Tell us about your business and what you're trying to fix. We'll reply within one business day with honest, specific next steps — even if we're not the right fit."
      />
      <section className={`wh ${styles.wrap}`}>
        <div className={`wh-inner ${styles.grid}`}>
          <div className={styles.formCol}>
            <Suspense fallback={<ContactForm />}><ContactFormFromUrl /></Suspense>
          </div>
          <aside className={styles.info}>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Call</p>
              <PhoneLink source="contact" />
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Email</p>
              <a href="mailto:webhub4u@gmail.com">webhub4u@gmail.com</a>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Based in</p>
              <p>Brampton, Ontario</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Serving</p>
              <p>
                The Greater Toronto Area — Mississauga, Toronto, Vaughan,
                Markham, Oakville, Milton &amp; beyond.
              </p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Response time</p>
              <p>Within one business day, usually much sooner.</p>
            </div>
          </aside>
        </div>
      </section>
      <section className={`wh ${styles.wrap}`} aria-labelledby="enquiry-brief-title">
        <div className="wh-inner">
          <p className="wh-eyebrow">A useful starting point</p>
          <h2 id="enquiry-brief-title" className="wh-display">Five things to bring to your brief.</h2>
          <p>You don’t need every answer before getting in touch. A short outline helps us scope the next step.</p>
          <ol>
            <li><strong>Customer:</strong> Who needs the website or tool?</li>
            <li><strong>Action:</strong> What should they be able to do?</li>
            <li><strong>Questions:</strong> What do they need to know first?</li>
            <li><strong>Follow-up:</strong> Who receives a request, and what happens next?</li>
            <li><strong>Success:</strong> What observable result will tell you it is working?</li>
          </ol>
          <p>Timing is confirmed after scope, content, integrations and approvals are established.</p>
        </div>
      </section>
      <BookingEmbed />
    </PageShell>
  );
}
