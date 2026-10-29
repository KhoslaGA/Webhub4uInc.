"use client";
import { useState } from "react";
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

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || result.ok !== true) throw new Error(result.error || "We couldn't send your enquiry. Please try again or email us directly.");
      setStatus("ok");
    } catch (err) {
      setError(err.message || "We couldn’t send your enquiry. Please try again or email us directly.");
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className={`wh ${styles.success}`} role="status">
        <p className={styles.successIcon}>✓</p>
        <h3>Thanks, {form.name.split(" ")[0] || "there"}!</h3>
        <p>
          Your message is in. We&apos;ll get back to you within one business
          day — usually much sooner.
        </p>
      </div>
    );
  }

  return (
    <form className={`wh ${styles.form}`} onSubmit={submit}>
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
      {status === "error" && (
        <p className={styles.err} role="alert">
          {error} <a href="mailto:webhub4u@gmail.com">webhub4u@gmail.com</a>
        </p>
      )}
    </form>
  );
};

export default ContactForm;
