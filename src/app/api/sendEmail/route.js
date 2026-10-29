import { Resend } from "resend";
import { handleContactRequest } from "@/lib/contactRequest.mjs";

export async function POST(req) {
  return handleContactRequest(req, {
    configured: Boolean(process.env.RESEND_API_KEY),
    send: (message) => new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM || "Webhub4U <onboarding@resend.dev>",
      to: process.env.EMAIL_TO || "webhub4u@gmail.com",
      ...message,
    }),
  });
}
