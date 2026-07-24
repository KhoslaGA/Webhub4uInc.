import crypto from "crypto";

/**
 * Meta Conversions API (server-side) — deduped with the browser Pixel via a
 * shared event_id. Dormant until META_PIXEL_ID + META_CAPI_TOKEN are set, so
 * it's safe to ship and activates on a Vercel redeploy with zero code change.
 *
 * PII (email/phone/name) is SHA-256 hashed here per Meta's requirement before
 * it ever leaves the server. Nothing is stored.
 */
const sha256 = (v) =>
  crypto.createHash("sha256").update(String(v)).digest("hex");

const hashEmail = (v) =>
  v ? sha256(String(v).trim().toLowerCase()) : undefined;
const hashText = (v) =>
  v ? sha256(String(v).trim().toLowerCase()) : undefined;
const hashPhone = (v) => {
  if (!v) return undefined;
  const digits = String(v).replace(/[^\d]/g, "");
  return digits ? sha256(digits) : undefined;
};

const prune = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export async function POST(req) {
  const PIXEL =
    process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const TOKEN = process.env.META_CAPI_TOKEN;

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  // Not configured yet — accept so the client flow never breaks.
  if (!PIXEL || !TOKEN) {
    return Response.json({ ok: true, via: "noop" });
  }

  const {
    event = "Lead",
    eventId,
    value,
    user = {},
    eventSourceUrl,
  } = body || {};

  const [firstName, ...rest] = String(user.name || "")
    .trim()
    .split(/\s+/);

  const userData = prune({
    em: hashEmail(user.email),
    ph: hashPhone(user.phone),
    fn: hashText(user.firstName || firstName),
    ln: hashText(user.lastName || rest.join(" ")),
    client_user_agent: req.headers.get("user-agent") || undefined,
    client_ip_address:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
  });

  const payload = {
    data: [
      prune({
        event_name: event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: value ? { value, currency: "CAD" } : undefined,
      }),
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const detail = await res.text();
      console.error("Meta CAPI error:", res.status, detail);
      return Response.json({ ok: false }, { status: 200 });
    }
    return Response.json({ ok: true, via: "capi" });
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
    return Response.json({ ok: false }, { status: 200 });
  }
}
