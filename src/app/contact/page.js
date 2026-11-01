import { Suspense } from "react";
import ContactFormFromUrl from "@/components/sections/new/ContactFormFromUrl";
import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import ContactForm from "@/components/sections/new/ContactForm";
import PhoneLink from "@/components/sections/new/PhoneLink";
import { BUSINESS } from "@/lib/business";
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
            Your next project.<br />
            <span className="wh-em">Let&apos;s talk it through.</span>
          </>
        }
        sub="A new website, better search visibility or a tool for your team. Tell us where you want to go — you don't need a finished brief."
      />
      <section className={`wh ${styles.wrap}`}>
        <div className={`wh-inner ${styles.grid}`}>
          <div id="project-enquiry" className={styles.formCol}>
            <Suspense fallback={<ContactForm />}><ContactFormFromUrl /></Suspense>
          </div>
          <aside className={styles.info} aria-labelledby="next-steps-title">
            <div className={styles.nextSteps}>
              <p className="wh-eyebrow">What happens next</p>
              <h2 id="next-steps-title">From your idea<br />to a clear next step.</h2>
              <ol>
                <li><strong>Share the essentials.</strong><span>Use the short form to prepare an email, or contact us directly.</span></li>
                <li><strong>We review your project.</strong><span>We look at your goals and identify any questions about the scope.</span></li>
                <li><strong>Agree the next step.</strong><span>We discuss the approach, timing and cost before any work begins.</span></li>
              </ol>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Call</p>
              <PhoneLink source="contact" />
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Email</p>
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </div>
            <p className={styles.local}>Based in Brampton. Working with businesses across Toronto and the GTA.</p>
          </aside>
        </div>
      </section>
      <BookingEmbed />
    </PageShell>
  );
}
