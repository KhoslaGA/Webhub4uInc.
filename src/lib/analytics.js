/**
 * Conversion event schema — define once, use everywhere (D1 Sprint 0.5).
 * Safe to call before GA4 / GTM is wired: it no-ops on the server and
 * pushes to dataLayer + gtag only if they exist. When GA4 goes live
 * (NEXT_PUBLIC_GA_ID), these events start flowing with zero code changes.
 *
 * Canonical events:
 *   lead_form_submit · call_click · demo_request · roi_calc_complete · pricing_view
 */
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    // Meta Pixel — custom events feed conversions + retargeting audiences
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", event, params);
    }
  } catch {
    /* analytics must never break the UI */
  }
}

/**
 * A conversion (e.g. "Lead") deduped across GA4 + Meta Pixel + Meta CAPI.
 * One shared event_id lets Meta count the browser Pixel event and the
 * server-side CAPI call once. Also sets GA Enhanced Conversions user data
 * (GA hashes it client-side). Safe no-op if nothing is configured.
 */
export function trackConversion(event, { value, params = {}, user } = {}) {
  if (typeof window === "undefined") return;
  const eventId =
    window.crypto?.randomUUID?.() ||
    `${event}-${Date.now()}-${(window.performance?.now?.() || 0) | 0}`;
  try {
    if (typeof window.gtag === "function") {
      if (user && (user.email || user.phone)) {
        window.gtag("set", "user_data", {
          email: user.email || undefined,
          phone_number: user.phone || undefined,
        });
      }
      window.gtag("event", event, { ...params, value, currency: "CAD" });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params, value });
    if (typeof window.fbq === "function") {
      window.fbq(
        "track",
        event,
        { ...params, value, currency: "CAD" },
        { eventID: eventId }
      );
    }
    // Server-side CAPI with the same event_id → deduped against the Pixel.
    fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        eventId,
        value,
        user,
        eventSourceUrl: window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the UI */
  }
}
