import test from "node:test";
import assert from "node:assert/strict";
import { handleContactRequest } from "../src/lib/contactRequest.mjs";

const enquiry = { name: "Example Person", email: "person@example.com", service: "custom-software-development", budget: "C$5,000–10,000", timing: "1–3 months", message: "A demonstration request." };
const request = (body) => new Request("https://example.com/api/sendEmail", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const failIfSent = async () => { assert.fail("Invalid or unconfigured submissions must not reach the provider"); };

test("unconfigured email returns unavailable instead of false success", async () => {
  const response = await handleContactRequest(request(enquiry), { configured: false, send: failIfSent });
  assert.equal(response.status, 503);
  assert.notEqual((await response.json()).ok, true);
});

test("provider rejection, exceptions and missing acceptance ID never produce success", async () => {
  for (const send of [async () => ({ error: { message: "Provider rejected" } }), async () => { throw new Error("Network failure"); }, async () => ({ data: {} })]) {
    const response = await handleContactRequest(request(enquiry), { configured: true, send });
    assert.equal(response.status, 502);
    assert.notEqual((await response.json()).ok, true);
  }
});

test("accepted email includes the selected service, budget and timing", async () => {
  let message;
  const response = await handleContactRequest(request(enquiry), { configured: true, send: async (value) => { message = value; return { data: { id: "test-id" } }; } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(message.replyTo, enquiry.email);
  assert.match(message.text, /Interested in: Custom software/);
  assert.ok(message.text.includes(enquiry.budget));
  assert.ok(message.text.includes(enquiry.timing));
});

test("malformed fields and header line breaks are rejected before delivery", async () => {
  for (const body of [null, [], { ...enquiry, name: {} }, { ...enquiry, email: "invalid" }, { ...enquiry, email: "x@example.com\nBcc: y@example.com" }, { ...enquiry, business: "Example\nInjected" }, { ...enquiry, name: " " }, { ...enquiry, message: "x".repeat(6001) }, { ...enquiry, service: "unknown" }, { ...enquiry, budget: "unknown" }, { ...enquiry, timing: "unknown" }]) {
    const response = await handleContactRequest(request(body), { configured: true, send: failIfSent });
    assert.equal(response.status, 400);
  }
});

test("invalid JSON returns a validation error", async () => {
  const response = await handleContactRequest(new Request("https://example.com", { method: "POST", body: "{" }), { configured: true, send: failIfSent });
  assert.equal(response.status, 400);
});

test("HTML-like content remains plain text in the outbound email", async () => {
  const text = '<a href="https://example.com">Example</a>';
  let outgoing;
  await handleContactRequest(request({ ...enquiry, message: text }), { configured: true, send: async (message) => { outgoing = message; return { data: { id: "test-id" } }; } });
  assert.equal(outgoing.html, undefined);
  assert.ok(outgoing.text.includes(text));
});
