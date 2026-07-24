"use client";
import { useState } from "react";
import { track, trackConversion } from "@/lib/analytics";
import styles from "./DemoRequestForm.module.css";

const VERTICALS = [
  "Trades / home services",
  "Clinic / health",
  "Professional services",
  "Restaurant / hospitality",
  "Retail / shop",
  "Other",
];

const TIMES = ["Anytime", "Morning", "Afternoon", "Evening"];

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

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      if (res.ok) {
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
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className={`wh ${styles.success}`}>
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
    <form className={`wh ${styles.form}`} onSubmit={submit}>
      <div className={styles.row}>
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
          />
        </label>
        <label>
          Business
          <input
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
            value={form.phone}
            onChange={update("phone")}
            placeholder="(555) 555-5555"
          />
        </label>
        <label>
          Email <span className={styles.optional}>(optional)</span>
          <input
            type="email"
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
        <p className={styles.err}>
          Something went wrong. Please email us at webhub4u@gmail.com.
        </p>
      )}
    </form>
  );
};

export default DemoRequestForm;
