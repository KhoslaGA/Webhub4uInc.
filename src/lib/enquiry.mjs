import { createHash, randomUUID } from "node:crypto";

export const MAX_BODY_BYTES = 16 * 1024;
export const DELIVERY_TIMEOUT_MS = 8000;
export const emailValid = (value) => /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(value);
export const json = (body, status = 200, headers = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
export const invalid = () => json({ ok: false, outcome: "rejected", error: "Please check your contact details and selected options." }, 400);

// Read incrementally: Content-Length alone is not trustworthy (or always present).
export async function readEnquiry(req) {
  if (req.method !== "POST") return { response: json({ ok: false, error: "Use POST to submit this form." }, 405, { Allow: "POST" }) };
  if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return { response: json({ ok: false, error: "Send the form as JSON." }, 415) };
  const tooLarge = () => ({ response: json({ ok: false, error: "Your message is too long. Please shorten it and try again." }, 413) });
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) return tooLarge();
  const reader = req.body?.getReader();
  if (!reader) return { response: invalid() };
  let bytes = 0;
  const chunks = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); return tooLarge(); }
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) return { response: invalid() };
    return { body };
  } catch { return { response: invalid() }; }
  finally { reader.releaseLock(); }
}

export function fields(body, limits) {
  const form = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = body[key] ?? "";
    if (typeof value !== "string" || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return null;
    if (key !== "message" && /[\r\n]/.test(value)) return null;
    form[key] = value.trim();
  }
  return form;
}

export function submissionId(body) {
  if (body.submissionId === undefined) return randomUUID();
  return typeof body.submissionId === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.submissionId) ? body.submissionId : null;
}

export function deliveryKey(kind, id, form) {
  // No personal information appears in headers or diagnostic identifiers.
  return `${kind}/${id}/${createHash("sha256").update(JSON.stringify(form)).digest("hex")}`;
}

export async function bounded(operation, timeoutMs = DELIVERY_TIMEOUT_MS) {
  const controller = new AbortController();
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => operation(controller.signal)),
      new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error("delivery_timeout")); }, timeoutMs); }),
    ]);
  } finally { clearTimeout(timer); }
}

export async function sendEmail(send, message, key, timeoutMs) {
  try {
    const result = await bounded(() => send(message, { idempotencyKey: key }), timeoutMs);
    // The SDK can resolve with an error instead of throwing.
    if (result?.error) return result.error.name === "application_error" || result.error.name === "internal_server_error" ? "unknown" : "rejected";
    if (typeof result?.data?.id === "string" && result.data.id.trim()) return "accepted";
    return "unknown";
  } catch { return "unknown"; }
}

export function deliveryResponse(outcome, requestId) {
  if (outcome === "accepted") return json({ ok: true, outcome, requestId });
  if (outcome === "unavailable") return json({ ok: false, outcome, requestId, error: "This form is temporarily unavailable. Your details are still here; please email us directly." }, 503);
  if (outcome === "unknown") return json({ ok: false, outcome, requestId, error: "We couldn't confirm delivery. Your details are still here. Please contact us to check before retrying; another submission could create a duplicate." }, 504);
  return json({ ok: false, outcome: "rejected", requestId, error: "Your request wasn't accepted. Your details are still here; please try again or email us directly." }, 502);
}
