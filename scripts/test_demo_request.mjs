import test from "node:test";
import assert from "node:assert/strict";
import { handleDemoRequest } from "../src/lib/demoRequest.mjs";

const lead = { name: "Example Person", phone: "(555) 010-0199", email: "person@example.com", business: "Example Plumbing", vertical: "Trades / home services", bestTime: "Morning", message: "We miss after-hours calls.", source: "lp-google-a-hero" };
const request = (body) => new Request("https://example.com/api/demo-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const failIfCalled = async () => { assert.fail("This provider must not be called"); };
const accepted = async () => ({ data: { id: "test-id" }, error: null });
const webhookOk = async () => ({ ok: true, status: 200 });
const webhookRejects = async () => ({ ok: false, status: 500 });
const webhookHangs = (_payload, signal) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(new Error("aborted"))));
const fast = { webhookTimeoutMs: 20, emailTimeoutMs: 20 };

// Every handler call runs with console.error captured, so each test can also
// assert that no personal enquiry data reached the logs.
async function run(body, providers) {
  const logged = [];
  const original = console.error;
  console.error = (...args) => logged.push(args.map(String).join(" "));
  try {
    const response = await handleDemoRequest(request(body), providers);
    return { response, json: await response.json(), logged };
  } finally {
    console.error = original;
  }
}

const assertNoPii = (logged) => {
  for (const line of logged) for (const value of [lead.name, lead.phone, lead.email, lead.business, lead.message]) assert.ok(!line.includes(value), `log leaked "${value}"`);
};

test("no configured provider returns 503 and never reports success", async () => {
  const { response, json } = await run(lead, { webhook: null, email: null });
  assert.equal(response.status, 503);
  assert.notEqual(json.ok, true);
  assert.ok(json.error);
});

test("webhook acceptance succeeds without touching email", async () => {
  let payload;
  const { response, json } = await run(lead, { webhook: async (p) => { payload = p; return webhookOk(); }, email: failIfCalled });
  assert.equal(response.status, 200);
  assert.deepEqual(json, { ok: true });
  assert.equal(payload.firstName, "Example");
  assert.equal(payload.lastName, "Person");
  assert.deepEqual(payload.tags, ["ai-receptionist-demo", lead.vertical]);
  assert.equal(payload.source, lead.source);
});

test("webhook rejection or timeout with no email fallback returns 502", async () => {
  for (const webhook of [webhookRejects, webhookHangs, async () => { throw new Error("network"); }]) {
    const { response, json, logged } = await run(lead, { webhook, email: null, ...fast });
    assert.equal(response.status, 502);
    assert.notEqual(json.ok, true);
    assertNoPii(logged);
  }
});

test("webhook rejection or timeout falls back to an accepted email", async () => {
  for (const webhook of [webhookRejects, webhookHangs]) {
    let sent;
    const { response, json, logged } = await run(lead, { webhook, email: async (m) => { sent = m; return accepted(); }, ...fast });
    assert.equal(response.status, 200);
    assert.deepEqual(json, { ok: true });
    assert.ok(sent, "fallback email was sent");
    assert.ok(logged.length >= 1, "the webhook failure is logged");
    assertNoPii(logged);
  }
});

test("a webhook timeout aborts the request", async () => {
  let aborted = false;
  await run(lead, { webhook: (p, signal) => { signal.addEventListener("abort", () => { aborted = true; }); return webhookHangs(p, signal); }, email: null, ...fast });
  assert.equal(aborted, true);
});

test("fallback email failure after webhook failure returns 502", async () => {
  const { response, json, logged } = await run(lead, { webhook: webhookRejects, email: async () => { throw new Error("provider down"); }, ...fast });
  assert.equal(response.status, 502);
  assert.notEqual(json.ok, true);
  assertNoPii(logged);
});

test("silent email rejection never produces success", async () => {
  const results = [
    { data: null, error: { name: "validation_error", message: "You can only send testing emails to your own email address" } },
    { data: {} },
    { data: { id: "" } },
    { data: { id: "has-id" }, error: { name: "application_error" } },
    undefined,
  ];
  for (const result of results) {
    const { response, json, logged } = await run(lead, { webhook: null, email: async () => result });
    assert.equal(response.status, 502, JSON.stringify(result));
    assert.notEqual(json.ok, true);
    assertNoPii(logged);
  }
});

test("an email provider that hangs times out as a failure", async () => {
  const { response } = await run(lead, { webhook: null, email: () => new Promise(() => {}), ...fast });
  assert.equal(response.status, 502);
});

test("accepted email is plain text with replyTo set only when an email was given", async () => {
  let sent;
  const html = '<a href="https://example.com">x</a>';
  const { response } = await run({ ...lead, message: html }, { webhook: null, email: async (m) => { sent = m; return accepted(); } });
  assert.equal(response.status, 200);
  assert.equal(sent.replyTo, lead.email);
  assert.equal(sent.reply_to, undefined);
  assert.equal(sent.html, undefined);
  assert.ok(sent.text.includes(html));
  assert.ok(sent.text.includes(`Phone: ${lead.phone}`));
  assert.match(sent.subject, /^Demo request: Example Person \(Example Plumbing\)$/);

  await run({ ...lead, email: "" }, { webhook: null, email: async (m) => { sent = m; return accepted(); } });
  assert.equal("replyTo" in sent, false);
});

test("malformed or out-of-bounds input is rejected before any provider is called", async () => {
  const bad = [
    null, [], "text",
    { ...lead, name: "" }, { ...lead, name: "   " }, { ...lead, name: {} }, { ...lead, name: "x".repeat(121) },
    { ...lead, phone: "" }, { ...lead, phone: "call me" }, { ...lead, phone: "12345" }, { ...lead, phone: 5550100199 },
    { ...lead, name: "Example\r\nBcc: someone@example.com" }, { ...lead, business: "Example\nInjected" },
    { ...lead, email: "invalid" }, { ...lead, email: "x@example.com\nBcc: y@example.com" },
    { ...lead, vertical: "Unknown" }, { ...lead, bestTime: "Midnight" },
    { ...lead, message: "x".repeat(3001) }, { ...lead, source: "bad source" }, { ...lead, source: "x".repeat(121) },
  ];
  for (const body of bad) {
    const { response, json } = await run(body, { webhook: failIfCalled, email: failIfCalled });
    assert.equal(response.status, 400, JSON.stringify(body)?.slice(0, 80));
    assert.notEqual(json.ok, true);
  }
});

test("invalid JSON returns a validation error", async () => {
  const response = await handleDemoRequest(new Request("https://example.com", { method: "POST", body: "{" }), { webhook: failIfCalled, email: failIfCalled });
  assert.equal(response.status, 400);
});

test("optional fields may be omitted", async () => {
  const { response } = await run({ name: "Example Person", phone: "5550100199" }, { webhook: null, email: accepted });
  assert.equal(response.status, 200);
});
