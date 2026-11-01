import test from "node:test";
import assert from "node:assert/strict";
import { contactEmailBody, contactEmailHref } from "../src/lib/contactEmail.mjs";

const form = { name: "A & B", email: "reviewer+test@example.com", service: "seo", message: "A website? Yes & more.\nSecond line: café", business: "Example Studio", phone: "416 555 0100", budget: "Not decided yet", timing: "Exploring options" };

test("email draft preserves the brief and cannot turn user content into mail headers", () => {
  const url = new URL(contactEmailHref(form, "owner@example.com"));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "owner@example.com");
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  assert.equal(url.searchParams.get("subject"), "Project enquiry — SEO & local search");
  assert.equal(url.searchParams.get("body"), contactEmailBody(form));
  assert.ok(url.searchParams.get("body").includes(form.message));
  const injected = new URL(contactEmailHref({ ...form, message: "&bcc=other@example.com#fragment" }, "owner@example.com"));
  assert.equal(injected.searchParams.has("bcc"), false);
  assert.equal(injected.hash, "");
});

test("minimal email brief omits empty optional fields and handles unknown services", () => {
  const brief = contactEmailBody({ ...form, business: " ", phone: "", message: "", service: "unknown" });
  assert.match(brief, /Interested in: Not sure yet/);
  assert.doesNotMatch(brief, /Business:|Phone:|Project outline:/);
  assert.match(brief, /Email: reviewer\+test@example.com/);
});


test("demo draft retains its purpose and originating page", () => {
  const draft = new URL(contactEmailHref({ ...form, service: "ai-receptionist" }, "owner@example.com", { demo: true, source: "lp/ai-receptionist-google" }));
  assert.equal(draft.searchParams.get("subject"), "AI receptionist demo enquiry");
  assert.match(draft.searchParams.get("body"), /AI receptionist demo/);
  assert.match(draft.searchParams.get("body"), /Website page: lp\/ai-receptionist-google/);
});
