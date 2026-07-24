import { Resend } from "resend";

/**
 * Demo / lead capture for the AI-receptionist offer.
 *
 * Delivery priority (first one configured wins):
 *   1. GHL_WEBHOOK_URL  — forwards a GoHighLevel-shaped payload. Designed so
 *      switching the funnel to GHL is a single env var, zero refactor.
 *   2. RESEND_API_KEY   — emails the lead (same pattern as /api/sendEmail).
 *   3. neither          — logs + accepts (200) so the UX never hard-fails.
 */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const {
    name,
    phone,
    email = "",
    business = "",
    vertical = "",
    bestTime = "",
    message = "",
    source = "webhub4u.com",
  } = body || {};

  if (!name || !phone) {
    return new Response("Name and phone are required", { status: 400 });
  }

  // Canonical GHL inbound-webhook contact shape — flat contact fields GHL can
  // map directly, plus the demo specifics as tags/customFields.
  const [firstName, ...rest] = String(name).trim().split(/\s+/);
  const ghlPayload = {
    firstName,
    lastName: rest.join(" ") || undefined,
    name,
    phone,
    email: email || undefined,
    companyName: business || undefined,
    source,
    tags: ["ai-receptionist-demo", vertical].filter(Boolean),
    customFields: { vertical, bestTime, message },
    submittedAt: new Date().toISOString(),
  };

  // 1) GHL webhook
  if (process.env.GHL_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      });
      if (!res.ok) throw new Error(`GHL responded ${res.status}`);
      return Response.json({ ok: true, via: "ghl" });
    } catch (error) {
      console.error("GHL webhook failed:", error);
      // fall through to email / accept so a lead is never dropped
    }
  }

  // 2) Resend email
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Webhub4U <onboarding@resend.dev>",
        to: process.env.EMAIL_TO || "webhub4u@gmail.com",
        reply_to: email || undefined,
        subject: `Demo request — ${name}${business ? ` (${business})` : ""}`,
        html: `
          <h2>New AI-receptionist demo request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Business:</strong> ${business || "—"}</p>
          <p><strong>Vertical:</strong> ${vertical || "—"}</p>
          <p><strong>Best time to reach:</strong> ${bestTime || "—"}</p>
          <p><strong>Email:</strong> ${email || "—"}</p>
          <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>
          <p style="color:#888"><em>Source: ${source}</em></p>
        `,
      });
      return Response.json({ ok: true, via: "email" });
    } catch (error) {
      console.error("Demo request email failed:", error);
      return new Response("Failed to submit", { status: 500 });
    }
  }

  // 3) Nothing configured yet — don't lose the lead in dev
  console.warn("No GHL_WEBHOOK_URL or RESEND_API_KEY set — demo request:", ghlPayload);
  return Response.json({ ok: true, via: "logged" });
}
