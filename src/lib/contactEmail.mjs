import { contactService } from "./contactOptions.mjs";

export function contactEmailBody(form, { demo = false, source = "" } = {}) {
  return [
    demo ? "Hi Webhub4U, I'd like to discuss an AI receptionist demo." : "Hi Webhub4U, I'd like to discuss a project.",
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    `Interested in: ${contactService(form.service)?.label || "Not sure yet"}`,
    form.business.trim() && `Business: ${form.business.trim()}`,
    form.phone.trim() && `Phone: ${form.phone.trim()}`,
    `Budget: ${form.budget}`,
    `Timing: ${form.timing}`,
    form.message.trim() && `Project outline:\n${form.message.trim()}`,
    source && `Website page: ${source}`,
  ].filter(Boolean).join("\n\n");
}

export function contactEmailHref(form, recipient, context = {}) {
  const subject = context.demo ? "AI receptionist demo enquiry" : `Project enquiry — ${contactService(form.service)?.label || "Let's talk"}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contactEmailBody(form, context))}`;
}
