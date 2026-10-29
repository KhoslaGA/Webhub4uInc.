import { VERTICALS, TIMES } from "./demoOptions.mjs";

// Demo / lead capture for the AI-receptionist offer.
//
// Delivery: the GHL webhook first, then the Resend email as a fallback. Success
// is reported only when a provider accepted the lead (webhook 2xx, or a Resend
// acceptance id with no error). Nothing configured → 503; nothing accepted → 502.
// Personal enquiry data never goes to application logs.

const LIMITS = { name: 120, phone: 40, email: 254, business: 200, vertical: 80, bestTime: 20, message: 3000, source: 120 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+().\-\s]+$/;
const SOURCE = /^[A-Za-z0-9][A-Za-z0-9./_-]*$/;

const json = (body, status) => Response.json(body, { status });
const invalid = () => json({ error: "Please check your name and phone number." }, 400);
const unavailable = () => json({ error: "Demo requests are temporarily unavailable. Please call or email us directly." }, 503);
const notDelivered = () => json({ error: "We couldn't send your request. Your details are still in the form; please try again, or call or email us directly." }, 502);

// Rejects after `ms`, and aborts the signal the call was given.
async function withTimeout(call, ms) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, ms);
  });
  try {
    return await Promise.race([call(controller.signal), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

export function parseDemoRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const form = {};
  for (const [key, limit] of Object.entries(LIMITS)) {
    const value = body[key] ?? "";
    if (typeof value !== "string" || value.length > limit) return null;
    form[key] = value.trim();
  }
  if (!form.name || !form.phone) return null;
  if (/[\r\n]/.test(form.name + form.phone + form.email + form.business + form.source)) return null;
  if (!PHONE.test(form.phone) || form.phone.replace(/\D/g, "").length < 7) return null;
  if (form.email && !EMAIL.test(form.email)) return null;
  if (form.vertical && !VERTICALS.includes(form.vertical)) return null;
  if (form.bestTime && !TIMES.includes(form.bestTime)) return null;
  if (form.source && !SOURCE.test(form.source)) return null;
  form.source ||= "webhub4u.com";
  return form;
}

// Canonical GHL inbound-webhook contact shape: flat contact fields GHL can map
// directly, plus the demo specifics as tags/customFields.
export function ghlPayload(form, now = new Date()) {
  const [firstName, ...rest] = form.name.split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" ") || undefined,
    name: form.name,
    phone: form.phone,
    email: form.email || undefined,
    companyName: form.business || undefined,
    source: form.source,
    tags: ["ai-receptionist-demo", form.vertical].filter(Boolean),
    customFields: { vertical: form.vertical, bestTime: form.bestTime, message: form.message },
    submittedAt: now.toISOString(),
  };
}

export function demoEmail(form) {
  return {
    ...(form.email ? { replyTo: form.email } : {}),
    subject: `Demo request: ${form.name}${form.business ? ` (${form.business})` : ""}`,
    text: [
      "New AI-receptionist demo request",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Business: ${form.business || "—"}`,
      `Vertical: ${form.vertical || "—"}`,
      `Best time to reach: ${form.bestTime || "—"}`,
      `Email: ${form.email || "—"}`,
      `Message:\n${form.message || "—"}`,
      `Source: ${form.source}`,
    ].join("\n\n"),
  };
}

/**
 * @param {Request} req
 * @param {object} providers
 * @param {null | ((payload: object, signal: AbortSignal) => Promise<{ ok: boolean, status?: number }>)} providers.webhook
 * @param {null | ((message: object) => Promise<{ data?: { id?: string }, error?: unknown }>)} providers.email
 */
export async function handleDemoRequest(req, { webhook = null, email = null, webhookTimeoutMs = 6000, emailTimeoutMs = 8000, now } = {}) {
  let body;
  try { body = await req.json(); } catch { return invalid(); }
  const form = parseDemoRequest(body);
  if (!form) return invalid();
  if (!webhook && !email) return unavailable();

  if (webhook) {
    try {
      const res = await withTimeout((signal) => webhook(ghlPayload(form, now?.()), signal), webhookTimeoutMs);
      if (res?.ok) return json({ ok: true }, 200);
      console.error(`Demo request: webhook rejected (HTTP ${res?.status ?? "unknown"})`);
    } catch (error) {
      console.error(`Demo request: webhook ${error?.message === "timeout" ? "timed out" : "failed"}`);
    }
  }

  if (email) {
    try {
      const result = await withTimeout(() => email(demoEmail(form)), emailTimeoutMs);
      if (!result?.error && result?.data?.id) return json({ ok: true }, 200);
      console.error(`Demo request: email not accepted (${result?.error?.name || "no acceptance id"})`);
    } catch (error) {
      console.error(`Demo request: email ${error?.message === "timeout" ? "timed out" : "failed"}`);
    }
  }

  return notDelivered();
}
