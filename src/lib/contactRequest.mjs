import { BUDGETS, TIMINGS, contactService } from "./contactOptions.mjs";
import { readEnquiry, fields, invalid, emailValid, submissionId, deliveryKey, sendEmail, deliveryResponse } from "./enquiry.mjs";

export async function handleContactRequest(req, { configured, send, timeoutMs }) {
  const { body, response } = await readEnquiry(req);
  if (response) return response;
  const form = fields(body, { name: 120, email: 254, phone: 60, business: 200, service: 80, message: 6000, budget: 80, timing: 80 });
  const id = submissionId(body);
  if (!form || !id || !form.name || !emailValid(form.email)) return invalid();
  const service = contactService(form.service);
  if (form.service && !service || form.budget && !BUDGETS.includes(form.budget) || form.timing && !TIMINGS.includes(form.timing)) return invalid();
  if (!configured) return deliveryResponse("unavailable", id);
  const outcome = await sendEmail(send, {
    replyTo: form.email,
    subject: `New enquiry from ${form.name}${form.business ? ` (${form.business})` : ""}`,
    text: ["New website enquiry", `Reference: ${id}`, `Name: ${form.name}`, `Business: ${form.business || "—"}`, `Email: ${form.email}`, `Phone: ${form.phone || "—"}`, `Interested in: ${service?.label || "Not specified"}`, `Budget: ${form.budget || "Not specified"}`, `Timing: ${form.timing || "Not specified"}`, `Message:\n${form.message || "—"}`].join("\n\n"),
  }, deliveryKey("contact", id, form), timeoutMs);
  return deliveryResponse(outcome, id);
}
