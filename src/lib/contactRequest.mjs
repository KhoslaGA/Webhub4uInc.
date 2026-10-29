import { BUDGETS, TIMINGS, contactService } from "./contactOptions.mjs";

const invalid = () => Response.json({ error: "Please check your name, email and project details." }, { status: 400 });

// Provider acceptance is required before the UI can show success.
// Keep personal enquiry data out of application logs.
export async function handleContactRequest(req, { configured, send }) {
  let body;
  try { body = await req.json(); } catch { return invalid(); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return invalid();
  const limits = { name: 120, email: 254, phone: 60, business: 200, service: 80, message: 6000, budget: 80, timing: 80 };
  const form = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = body[key] ?? "";
    if (typeof value !== "string" || value.length > limit) return invalid();
    form[key] = value.trim();
  }
  if (!form.name || /[\r\n]/.test(form.name + form.business + form.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return invalid();
  const service = contactService(form.service);
  if (form.service && !service) return invalid();
  if (form.budget && !BUDGETS.includes(form.budget)) return invalid();
  if (form.timing && !TIMINGS.includes(form.timing)) return invalid();
  if (!configured) return Response.json({ error: "The enquiry form is temporarily unavailable. Please email us directly." }, { status: 503 });
  try {
    const result = await send({
      replyTo: form.email,
      subject: `New enquiry from ${form.name}${form.business ? ` (${form.business})` : ""}`,
      text: [
        "New website enquiry", `Name: ${form.name}`, `Business: ${form.business || "—"}`,
        `Email: ${form.email}`, `Phone: ${form.phone || "—"}`, `Interested in: ${service?.label || "Not specified"}`,
        `Budget: ${form.budget || "Not specified"}`, `Timing: ${form.timing || "Not specified"}`, `Message:\n${form.message || "—"}`,
      ].join("\n\n"),
    });
    if (result?.error || !result?.data?.id) throw new Error("Provider did not accept the enquiry");
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "We couldn't send your enquiry. Your details are still in the form; please try again or email us directly." }, { status: 502 });
  }
}
