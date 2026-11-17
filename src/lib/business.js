/**
 * Canonical business facts — single source of truth for NAP, contact, and
 * the offer stack. The address/phone here MUST match the Google Business
 * Profile and every citation exactly (D3). Fill the TODOs before launch.
 *
 * Anything left empty degrades gracefully in the UI (e.g. an unset demoPhone
 * turns the "call our demo line" CTA into a "book a demo" link instead of
 * shipping a fake tel: number).
 */
export const BUSINESS = {
  name: "Webhub4U",
  legalName: "Webhub4U Inc.",
  email: "webhub4u@gmail.com",
  phone: "(647) 504-8468", // main business line — keep matched to GBP + citations
  demoPhone: "", // TODO: Vapi AI-receptionist demo line (the page IS the demo)
  city: "Brampton",
  region: "ON",
  country: "CA",
  areaServed: "Greater Toronto Area",
  url: "https://www.webhub4u.com",
};

/** Offer pricing (D1). Adjust to the live offer stack. */
export const OFFER = {
  aiReceptionist: { setup: 997, monthly: 397 },
  missedCallTextBack: { monthly: 197 },
};

/**
 * Cinematic property websites (/real-estate-websites). Operator-controlled:
 *  - indexable: false keeps the page noindex, out of the sitemap and out of
 *    the services grid on city pages. Flip to true only once a real demo
 *    sequence exists in public/demos/<demoSlug>/.
 *  - demoSlug: folder written by `node scripts/frames.mjs <clip> <slug>`.
 *  - demoCaption: always-visible label on the demo. Keep it accurate to the clip
 *    (e.g. "Concept rendering" for AI-generated footage of an unbuilt space).
 *  - priceFrom: null = no price shown anywhere; the page says "Scoped per property".
 */
export const REAL_ESTATE = {
  indexable: false,
  demoSlug: "concept-villa",
  demoCaption: "Concept rendering · not a client property",
  priceFrom: null,
};

/**
 * Blog author for E-E-A-T (Article schema + author box). For stronger E-E-A-T,
 * set the founder's REAL name and add a headshot at /public/author.jpg, then
 * point `image` at it — Google weights a real, credentialed author.
 */
export const AUTHOR = {
  name: "The Webhub4U Team", // TODO: swap for the founder's real name
  role: "Webhub4U · Brampton, ON",
  bio: "We build websites, local SEO, and AI tools for GTA businesses — and write about what actually works for local operators.",
  image: "", // TODO: e.g. "/author.jpg"
};

/** tel: href from a display number, or null if not set. Adds +1 for 10-digit NANP numbers. */
export const telHref = (num) => {
  if (!num) return null;
  const digits = num.replace(/[^\d+]/g, "");
  if (/^\d{10}$/.test(digits)) return "tel:+1" + digits;
  return "tel:" + digits;
};
