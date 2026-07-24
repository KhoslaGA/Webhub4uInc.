import styles from "./BookingEmbed.module.css";

/**
 * GoHighLevel (or any) calendar embed. Renders nothing until
 * NEXT_PUBLIC_GHL_CALENDAR_URL is set, so it ships dormant and turns on with
 * an env var + redeploy — killing the email-only funnel with self-booking.
 */
const BookingEmbed = ({ title = "Book a 15-minute demo call" }) => {
  const url = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL;
  if (!url) return null;
  return (
    <section className={`wh ${styles.wrap}`}>
      <div className="wh-inner">
        <p className="wh-eyebrow">Book instantly</p>
        <h2 className={`wh-display ${styles.h2}`}>
          Grab a time that <span className="wh-em">suits you.</span>
        </h2>
        <div className={styles.frameWrap}>
          <iframe
            src={url}
            title={title}
            className={styles.frame}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default BookingEmbed;
