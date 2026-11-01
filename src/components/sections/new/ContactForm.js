"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import { contactEmailBody, contactEmailHref } from "@/lib/contactEmail.mjs";
import { CONTACT_SERVICES, BUDGETS, TIMINGS, contactService } from "@/lib/contactOptions.mjs";
import styles from "./ContactForm.module.css";

const ContactForm = ({ initialService = "not-sure", demo = false, source = "" }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", business: "",
    service: contactService(initialService)?.value || "not-sure",
    budget: BUDGETS[0], timing: TIMINGS[0], message: "",
  });
  const context = { demo, source };
  const [notice, setNotice] = useState("");
  const [showBrief, setShowBrief] = useState(false);
  const briefRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  useEffect(() => {
    if (showBrief) { briefRef.current?.focus(); briefRef.current?.select(); }
  }, [showBrief]);
  const update = (key) => (e) => {
    setForm(current => ({ ...current, [key]: e.target.value }));
    setNotice("");
  };
  const submit = (e) => {
    e.preventDefault();
    setNotice("Your email app should open with your brief. Review it and press Send there to complete your enquiry.");
    window.location.href = contactEmailHref(form, BUSINESS.email, context);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactEmailBody(form, context));
      setNotice(`Brief copied. Paste it into an email to ${BUSINESS.email} and send it when you're ready.`);
    } catch {
      setShowBrief(true);
      setNotice("Select and copy your brief below, then paste it into an email to us.");
    }
  };

  return (
    <form className={`wh ${styles.form}`} onSubmit={submit} aria-label="Project enquiry">
      <div className={styles.intro}>
        <p className="wh-eyebrow">A simple starting point</p>
        <h2>{demo ? "Ask about a demo." : "Email us your project brief."}</h2>
        <p>Just your name and email to start. Add as much detail as you have.</p>
      </div>
      <div className={styles.row}>
        <label>Name<input required name="name" maxLength={120} autoComplete="name" value={form.name} onChange={update("name")} placeholder="Your name" /></label>
        <label>Email<input required name="email" maxLength={254} autoComplete="email" type="email" value={form.email} onChange={update("email")} placeholder="you@business.com" /></label>
      </div>
      <label>What can we help with?
        <select name="service" value={form.service} onChange={update("service")}>
          {CONTACT_SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
      <label>What would you like to build or improve? (optional)
        <textarea name="message" rows={3} maxLength={1500} value={form.message} onChange={update("message")} placeholder="A new website, more local enquiries, a better way to manage your work…" />
      </label>
      <details className={styles.optional}>
        <summary>Add business, phone, budget or timing <span>(optional)</span></summary>
        <div className={styles.extraFields}>
          <div className={styles.row}>
            <label>Business (optional)<input name="business" maxLength={200} autoComplete="organization" value={form.business} onChange={update("business")} placeholder="Business name" /></label>
            <label>Phone (optional)<input name="phone" maxLength={60} autoComplete="tel" type="tel" value={form.phone} onChange={update("phone")} placeholder="Your contact number" /></label>
          </div>
          <div className={styles.row}>
            <label>Indicative budget (optional)<select name="budget" value={form.budget} onChange={update("budget")}>{BUDGETS.map(b => <option key={b}>{b}</option>)}</select></label>
            <label>Ideal timing (optional)<select name="timing" value={form.timing} onChange={update("timing")}>{TIMINGS.map(t => <option key={t}>{t}</option>)}</select></label>
          </div>
        </div>
      </details>
      <noscript><p>Email us directly at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.</p></noscript>
      <div className={styles.actions}>
        <button type="submit" disabled={!ready} className="wh-btn wh-btn--primary">{demo ? "Open demo email" : "Open email draft"} <span aria-hidden="true">↗</span></button>
        <button type="button" disabled={!ready} className={styles.copy} onClick={copy}>Copy brief</button>
      </div>
      <p className={styles.handoff}>Opens your email app with your details filled in. Review and send it there. Nothing is submitted through this page.</p>
      <p className={styles.privacy}>We use enquiries to discuss your project. No marketing signup. <Link href="/privacy-policy">Privacy policy</Link></p>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {showBrief && <label>Copy your brief<textarea aria-label="Copy your brief" ref={briefRef} readOnly rows={7} value={contactEmailBody(form, context)} /></label>}
      <p className={styles.direct}>Prefer to write your own? <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></p>
    </form>
  );
};

export default ContactForm;
