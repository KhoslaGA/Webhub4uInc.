import PageShell from "@/components/sections/new/PageShell";
import PageHero from "@/components/sections/new/PageHero";
import ContactForm from "@/components/sections/new/ContactForm";
import PhoneLink from "@/components/sections/new/PhoneLink";
import BookingEmbed from "@/components/sections/new/BookingEmbed";
import styles from "@/components/sections/new/ContactPage.module.css";

export const metadata = {
  title: "Contact | Webhub4U — Web Design & AI in the GTA",
  description:
    "Book a free 20-minute consult with Webhub4U. Websites, local SEO, and AI tools for businesses across Brampton, Mississauga, Toronto, and the GTA.",
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
            <ContactForm />
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
      <BookingEmbed />
    </PageShell>
  );
}
