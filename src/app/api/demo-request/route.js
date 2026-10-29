import { Resend } from "resend";
import { handleDemoRequest } from "@/lib/demoRequest.mjs";

/**
 * Demo / lead capture for the AI-receptionist offer.
 *
 * Delivery: GHL_WEBHOOK_URL first (a GoHighLevel-shaped payload, so switching
 * the funnel to GHL is a single env var), then RESEND_API_KEY as the fallback.
 * Success requires a provider's acceptance; see src/lib/demoRequest.mjs.
 */
export async function POST(req) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  return handleDemoRequest(req, {
    webhook: webhookUrl
      ? (payload, signal) =>
          fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal,
          })
      : null,
    email: resendKey
      ? (message) =>
          new Resend(resendKey).emails.send({
            from: process.env.EMAIL_FROM || "Webhub4U <onboarding@resend.dev>",
            to: process.env.EMAIL_TO || "webhub4u@gmail.com",
            ...message,
          })
      : null,
  });
}
