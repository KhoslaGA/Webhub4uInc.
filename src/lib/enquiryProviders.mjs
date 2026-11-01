import { Resend } from "resend";
import { emailValid } from "./enquiry.mjs";

export function enquiryProviders(env = process.env) {
  // A preview must never start a live CRM workflow or send an owner email.
  if (env.VERCEL_ENV === "preview") return { configured: false };
  const from = env.EMAIL_FROM?.trim();
  const to = env.EMAIL_TO?.trim();
  const sender = from?.match(/<([^<>]+)>$/)?.[1] || from;
  const configured = Boolean(env.RESEND_API_KEY?.trim() && from && !/[\r\n]/.test(from) && emailValid(sender) && to && emailValid(to));
  let webhookUrl;
  try {
    const url = new URL(env.GHL_WEBHOOK_URL);
    if (url.protocol === "https:" && !url.username && !url.password) webhookUrl = url.href;
  } catch { /* Unset or unusable provider configuration. */ }
  return {
    configured, webhookUrl,
    send: (message, options) => new Resend(env.RESEND_API_KEY).emails.send({ ...message, from, to }, options),
  };
}
