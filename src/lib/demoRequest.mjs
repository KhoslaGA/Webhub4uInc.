import { VERTICALS, TIMES, DEMO_SOURCES } from "./demoOptions.mjs";
import { readEnquiry, fields, invalid, emailValid, submissionId, deliveryKey, bounded, sendEmail, deliveryResponse } from "./enquiry.mjs";

export async function handleDemoRequest(req, { configured, send, webhookUrl, fetcher = fetch, timeoutMs }) {
  const { body, response } = await readEnquiry(req);
  if (response) return response;
  const form = fields(body, { name: 120, phone: 60, email: 254, business: 200, vertical: 80, bestTime: 40, message: 6000, source: 100 });
  const id = submissionId(body);
  if (!form || !id || !form.name || !/^[+()\d .-]{7,60}$/.test(form.phone) || form.phone.replace(/\D/g, "").length < 7 || form.email && !emailValid(form.email)) return invalid();
  if (form.vertical && !VERTICALS.includes(form.vertical) || form.bestTime && !TIMES.includes(form.bestTime) || form.source && !DEMO_SOURCES.includes(form.source)) return invalid();
  if (!configured && !webhookUrl) return deliveryResponse("unavailable", id);
  if (webhookUrl) {
    const [firstName, ...rest] = form.name.split(/\s+/);
    const payload = { firstName, lastName: rest.join(" ") || undefined, name: form.name, phone: form.phone, email: form.email || undefined, companyName: form.business || undefined, source: form.source || "webhub4u.com", tags: ["ai-receptionist-demo", form.vertical].filter(Boolean), customFields: { vertical: form.vertical, bestTime: form.bestTime, message: form.message }, submissionId: id };
    let outcome = "unknown";
    try {
      outcome = await bounded(async (signal) => {
        const res = await fetcher(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal, redirect: "error" });
        // Definite client rejection permits email fallback. Timeouts and server
        // failures may occur AFTER a workflow starts: never repeat that write.
        if (res.status >= 400 && res.status < 500 && res.status !== 408) return "rejected";
        if (!res.ok) return "unknown";
        const result = await res.json();
        // HighLevel's inbound-webhook setup documents a returned ID. A 2xx
        // without that acknowledgement is not enough to claim acceptance.
        return typeof result?.id === "string" && result.id.trim() && !result.error && result.success !== false ? "accepted" : "unknown";
      }, timeoutMs);
    } catch { outcome = "unknown"; }
    if (outcome !== "rejected" || !configured) return deliveryResponse(outcome, id);
  }
  const outcome = await sendEmail(send, {
    replyTo: form.email || undefined,
    subject: `Demo request — ${form.name}${form.business ? ` (${form.business})` : ""}`,
    text: ["AI receptionist demo request (not a confirmed booking)", `Reference: ${id}`, `Name: ${form.name}`, `Phone: ${form.phone}`, `Business: ${form.business || "—"}`, `Business type: ${form.vertical || "—"}`, `Preferred time: ${form.bestTime || "—"}`, `Email: ${form.email || "—"}`, `Message:\n${form.message || "—"}`, `Source: ${form.source || "webhub4u.com"}`].join("\n\n"),
  }, deliveryKey("demo", id, form), timeoutMs);
  return deliveryResponse(outcome, id);
}
