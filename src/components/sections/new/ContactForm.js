"use client";
import { useRef, useState } from "react";
import { submitEnquiry } from "@/lib/submitEnquiry.mjs";
import styles from "./ContactForm.module.css";

import { CONTACT_SERVICES, BUDGETS, TIMINGS, contactService } from "@/lib/contactOptions.mjs";

const ContactForm = ({ initialService = "not-sure" }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    service: contactService(initialService)?.value || "not-sure",
    budget: BUDGETS[0],
    timing: TIMINGS[0],
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error

  const [error, setError] = useState("");

  const inFlight = useRef(false);
  const attempt = useRef({});
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("sending");
    setError("");
    try {
      await submitEnquiry("/api/sendEmail", form, attempt.current);
      setStatus("ok");
    } catch (err) {
      setError(err.message || "We couldn't confirm delivery. Please contact us before retrying.");
      setStatus("error");
    } finally { inFlight.current = false; }
  };

  if (status === "ok") {
    return (
      <div className={`wh ${styles.success}`} role="status" tabIndex={-1} ref={(node) => node?.focus()}>
        <p className={styles.successIcon}>✓</p>
        <h3>Thanks, {form.name.split(" ")[0] || "there"}!</h3>
        <p>
          Your enquiry was accepted for delivery. We’ll review your project details and follow up with next steps.
        </p>
      </div>
    );
  }

  return (
    <form className={`wh ${styles.form}`} onSubmit={submit} aria-busy={status === "sending"}>
      <fieldset disabled={status === "sending"} className={styles.fields}>
      <div className={styles.row}>
        <label>
          Name
          <input required maxLength={120} autoComplete="name" value={form.name} onChange={update("name")} placeholder="Your name" />
        </label>
        <label>
          Business
          <input maxLength={200} autoComplete="organization" value={form.business} onChange={update("business")} placeholder="Business name" />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Email
          <input required maxLength={254} autoComplete="email" type="email" value={form.email} onChange={update("email")} placeholder="you@business.com" />
        </label>
        <label>
          Phone
          <input maxLength={60} autoComplete="tel" type="tel" value={form.phone} onChange={update("phone")} placeholder="(555) 555-5555" />
        </label>
      </div>
      <label>
        What can we help with?
        <select value={form.service} onChange={update("service")}>
          {CONTACT_SERVICES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
      <div className={styles.row}>
        <label>Indicative budget (optional)
          <select value={form.budget} onChange={update("budget")}>
            {BUDGETS.map((budget) => <option key={budget}>{budget}</option>)}
          </select>
        </label>
        <label>Ideal timing (optional)
          <select value={form.timing} onChange={update("timing")}>
            {TIMINGS.map((timing) => <option key={timing}>{timing}</option>)}
          </select>
        </label>
      </div>
      <label>
        Tell us a bit more
        <textarea
          rows={5}
          maxLength={6000}
          value={form.message}
          onChange={update("message")}
          placeholder="Who is this for, what should they be able to do, and which tools do you already use?"
        />
      </label>
      <button
        type="submit"
        className="wh-btn wh-btn--primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      </fieldset>
      <p className={styles.pending} role="status">{status === "sending" ? "Sending your request…" : ""}</p>
      {status === "error" && (
        <p className={styles.err} role="alert">
          {error} <a href="mailto:webhub4u@gmail.com">webhub4u@gmail.com</a>
        </p>
      )}
    </form>
  );
};

export default ContactForm;
