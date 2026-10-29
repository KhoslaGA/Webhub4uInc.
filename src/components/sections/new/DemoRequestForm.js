"use client";
import { useState } from "react";
import { track, trackConversion } from "@/lib/analytics";
import { BUSINESS, telHref } from "@/lib/business";
import { VERTICALS, TIMES } from "@/lib/demoOptions.mjs";
import styles from "./DemoRequestForm.module.css";

const FALLBACK_ERROR = "We couldn't send your request. Your details are still in the form; please try again, or call or email us directly.";

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

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      const result = await res.json().catch(() => ({}));
      // Only an explicit acceptance from the API counts as success.
      if (!res.ok || result.ok !== true) throw new Error(result.error || FALLBACK_ERROR);
      setStatus("ok");
      track("demo_request", { vertical: form.vertical, source });
      trackConversion("Lead", {
        params: { vertical: form.vertical, source },
        user: {
          name: form.name,
          phone: form.phone,
          email: form.email,
        },
      });
    } catch (err) {
      setError(err.message || FALLBACK_ERROR);
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className={`wh ${styles.success}`} role="status">
        <p className={styles.successIcon}>✓</p>
        <h3>You&apos;re in, {form.name.split(" ")[0] || "there"}.</h3>
        <p>
          We&apos;ll reach out {form.phone ? `at ${form.phone}` : "shortly"}
          {form.bestTime && form.bestTime !== "Anytime"
            ? ` (${form.bestTime.toLowerCase()})`
            : ""}{" "}
          to set up a live demo — you&apos;ll hear exactly what your callers
          would hear.
        </p>
      </div>
    );
  }

  return (
    <form className={`wh ${styles.form}`} onSubmit={submit} aria-describedby={status === "error" ? "demo-request-error" : undefined}>
      <div className={styles.row}>
        <label>
          Name
          <input
            required
            maxLength={120}
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
          />
        </label>
        <label>
          Business
          <input
            maxLength={200}
            autoComplete="organization"
            value={form.business}
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
            type="tel"
            maxLength={40}
            autoComplete="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="(555) 555-5555"
          />
        </label>
        <label>
          Email <span className={styles.optional}>(optional)</span>
          <input
            type="email"
            maxLength={254}
            autoComplete="email"
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
          rows={3}
          maxLength={3000}
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
        {status === "sending" ? "Sending…" : "Get my live demo"}
      </button>
      {status === "error" && (
        <p id="demo-request-error" className={styles.err} role="alert">
          {error}{" "}
          <a href={telHref(BUSINESS.phone)}>{BUSINESS.phone}</a>
          {" · "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        </p>
      )}
    </form>
  );
};

export default DemoRequestForm;
