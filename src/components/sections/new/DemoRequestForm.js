"use client";
import { useRef, useState } from "react";
import { track, trackConversion } from "@/lib/analytics";
import { submitEnquiry } from "@/lib/submitEnquiry.mjs";
import styles from "./DemoRequestForm.module.css";

import { VERTICALS, TIMES } from "@/lib/demoOptions.mjs";

const DemoRequestForm = ({ source = "webhub4u.com/ai-receptionist" }) => {
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
    vertical: VERTICALS[0],
    bestTime: TIMES[0],
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
      await submitEnquiry("/api/demo-request", { ...form, source }, attempt.current);
      setStatus("ok");
      track("demo_request", { vertical: form.vertical, source });
      trackConversion("Lead", { params: { vertical: form.vertical, source } });
    } catch (err) {
      setError(err.message || "We couldn't confirm delivery. Please contact us before retrying.");
      setStatus("error");
    } finally { inFlight.current = false; }
  };

  if (status === "ok") {
    return (
      <div className={`wh ${styles.success}`} role="status" tabIndex={-1} ref={(node) => node?.focus()}>
        <p className={styles.successIcon}>✓</p>
        <h3>Thanks, {form.name.split(" ")[0] || "there"}.</h3>
        <p>Your demo request was accepted for delivery. We’ll follow up to discuss a suitable time. Your demo is not booked yet.</p>
      </div>
    );
  }

  return (
    <form className={`wh ${styles.form}`} onSubmit={submit} aria-busy={status === "sending"}>
      <fieldset disabled={status === "sending"} className={styles.fields}>
      <div className={styles.row}>
        <label>
          Name
          <input
            required maxLength={120} autoComplete="name"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
          />
        </label>
        <label>
          Business
          <input
            maxLength={200} autoComplete="organization" value={form.business}
            onChange={update("business")}
            placeholder="Business name"
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Phone
          <input
            required
            type="tel" maxLength={60} autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="(555) 555-5555"
          />
        </label>
        <label>
          Email <span className={styles.optional}>(optional)</span>
          <input
            type="email" maxLength={254} autoComplete="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@business.com"
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Your business is…
          <select value={form.vertical} onChange={update("vertical")}>
            {VERTICALS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Best time to reach you
          <select value={form.bestTime} onChange={update("bestTime")}>
            {TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Anything we should know? <span className={styles.optional}>(optional)</span>
        <textarea
          rows={3} maxLength={6000}
          value={form.message}
          onChange={update("message")}
          placeholder="e.g. we miss a lot of after-hours calls, or we already use a booking tool"
        />
      </label>
      <button
        type="submit"
        className="wh-btn wh-btn--primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Request a demo"}
      </button>
      </fieldset>
      <p className={styles.pending} role="status">{status === "sending" ? "Sending your request…" : ""}</p>
      {status === "error" && (
        <p className={styles.err} role="alert">
          {error} <a href="mailto:webhub4u@gmail.com">Email Webhub4U</a>.
        </p>
      )}
    </form>
  );
};

export default DemoRequestForm;
