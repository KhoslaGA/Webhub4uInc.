import test from "node:test";
import assert from "node:assert/strict";
import { handleContactRequest } from "../src/lib/contactRequest.mjs";
import { handleDemoRequest } from "../src/lib/demoRequest.mjs";
import { enquiryProviders } from "../src/lib/enquiryProviders.mjs";
import { submitEnquiry } from "../src/lib/submitEnquiry.mjs";
import { POST as contactRoute } from "../src/app/api/sendEmail/route.js";
import { POST as demoRoute } from "../src/app/api/demo-request/route.js";

const contact = { name: "Test Person", email: "test@example.com", service: "seo", message: "Synthetic test only" };
const demo = { name: "Test Person", phone: "416 555 0100", email: "test@example.com", business: "Example", vertical: "Other", bestTime: "Morning", source: "lp-google-a", message: "<script>synthetic</script>" };
const request = (body) => new Request("http://localhost/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const forbidden = () => assert.fail("Provider must not be called");
const accepted = async () => ({ data: { id: "synthetic-id" }, error: null });
const webhookUrl = "https://example.com/mock";
const modes = [["contact", handleContactRequest, contact], ["demo", handleDemoRequest, demo]];

for (const [name, handler, body] of modes) {
  test(`${name}: missing configuration, invalid JSON/types/options and oversized bytes fail closed`, async () => {
    assert.equal((await handler(request(body), { configured: false, send: forbidden })).status, 503);
    for (const data of [null, [], {...body, name: {}}, {...body, name: "x\r\ny"}, {...body, email: "invalid"}, {...body, message: "x".repeat(6001)}, {...body, submissionId: "not-a-uuid"}]) {
      assert.equal((await handler(request(data), { configured: true, send: forbidden })).status, 400);
    }
    assert.equal((await handler(request({...body, extra: "é".repeat(9000)}), { configured: true, send: forbidden })).status, 413);
    assert.equal((await handler(new Request("http://localhost", {method:"GET"}), {send:forbidden})).status, 405);
    assert.equal((await handler(new Request("http://localhost", {method:"POST", body:"{}"}), {send:forbidden})).status, 415);
  });
  test(`${name}: returned errors, missing IDs, thrown errors, rate limits and timeouts never succeed`, async () => {
    for (const send of [async()=>({error:{name:"validation_error"}}), async()=>({error:{name:"rate_limit_exceeded"}}), async()=>({data:{}}), async()=>({data:{id:" "}}), async()=>({data:{id:"x"},error:{name:"bad"}}), async()=>{throw Error("private provider details");}, async()=>new Promise(()=>{})]) {
      const res = await handler(request(body), { configured: true, send, timeoutMs: 5 });
      assert.ok([502,504].includes(res.status));
      const result = await res.json();
      assert.equal(result.ok,false);
      assert.ok(!JSON.stringify(result).includes("private provider"));
    }
  });
  test(`${name}: acceptance has explicit outcome, plain text and a stable retry key`, async () => {
    const keys=[]; const messages=[];
    const payload={...body, submissionId:"12345678-1234-4123-8123-123456789012"};
    const send=async(message,options)=>{messages.push(message); keys.push(options.idempotencyKey); return accepted();};
    for(let i=0;i<2;i++) {
      const res=await handler(request(payload),{configured:true,send});
      assert.equal(res.status,200); assert.equal((await res.json()).outcome,"accepted");
    }
    assert.equal(keys[0],keys[1]);
    assert.equal(messages[0].replyTo,body.email);
    assert.equal(messages[0].html,undefined);
    assert.ok(messages[0].text.includes(body.message));
    assert.ok(!keys[0].includes(body.email));
  });
}

test("demo: every published landing-page source is allowed; malformed fields are rejected",async()=>{
  for(const source of ["lp-google-a","lp-google-b","lp-meta-a","lp-meta-b","webhub4u.com/ai-receptionist"]) assert.equal((await handleDemoRequest(request({...demo,source}),{configured:true,send:accepted})).status,200);
  for(const changes of [{phone:"abc"},{phone:4},{vertical:"fake"},{bestTime:"fake"},{source:"https://attacker.example"}]) assert.equal((await handleDemoRequest(request({...demo,...changes}),{configured:true,send:forbidden})).status,400);
});

test("GHL: explicit acknowledgement succeeds without fallback",async()=>{
  let sent;
  const res=await handleDemoRequest(request(demo),{configured:true,send:forbidden,webhookUrl,fetcher:async(url,options)=>{sent=JSON.parse(options.body);return Response.json({id:"webhook-id"});}});
  assert.equal((await res.json()).outcome,"accepted"); assert.equal(sent.customFields.message,demo.message); assert.ok(sent.submissionId);
});

test("GHL: definite rejection tries email once; acceptance/rejection and absent fallback are honest",async()=>{
  for(const [send,status] of [[accepted,200],[async()=>({error:{name:"validation_error"}}),502]]) {
    let count=0;
    const res=await handleDemoRequest(request(demo),{configured:true,send:async(...args)=>{count++;return send(...args);},webhookUrl,fetcher:async()=>new Response("No",{status:400})});
    assert.equal(res.status,status); assert.equal(count,1);
  }
  const res=await handleDemoRequest(request(demo),{configured:false,send:forbidden,webhookUrl,fetcher:async()=>new Response("No",{status:429})});
  assert.equal(res.status,502);
});

test("GHL: timeout, network, 5xx, 408, malformed or missing acknowledgement stay unknown without fallback",async()=>{
  for(const fetcher of [async()=>new Promise(()=>{}),async()=>{throw Error("network");},async()=>new Response("",{status:500}),async()=>new Response("",{status:408}),async()=>Response.json({ok:true}),async()=>Response.json({id:"id",error:"no"}),async()=>new Response("not-json")]) {
    const res=await handleDemoRequest(request(demo),{configured:true,send:forbidden,webhookUrl,fetcher,timeoutMs:5});
    assert.equal(res.status,504); assert.equal((await res.json()).outcome,"unknown");
  }
});

test("provider configuration requires explicit sender and recipient; preview always disables delivery",()=>{
  const env={RESEND_API_KEY:"test-only",EMAIL_FROM:"Example <sender@example.com>",EMAIL_TO:"owner@example.com",GHL_WEBHOOK_URL:webhookUrl};
  assert.equal(enquiryProviders(env).configured,true);
  for(const field of ["RESEND_API_KEY","EMAIL_FROM","EMAIL_TO"]) assert.equal(enquiryProviders({...env,[field]:""}).configured,false);
  assert.equal(enquiryProviders({...env,EMAIL_TO:"owner@example.com\r\nBcc:other@example.com"}).configured,false);
  assert.equal(enquiryProviders({...env,VERCEL_ENV:"preview"}).configured,false);
  assert.equal(enquiryProviders({...env,VERCEL_ENV:"preview"}).webhookUrl,undefined);
});

test("actual route exports are safe with preview isolation, even with fake provider variables present",async()=>{
  const prior=process.env.VERCEL_ENV;
  process.env.VERCEL_ENV="preview";
  try { assert.equal((await contactRoute(request(contact))).status,503); assert.equal((await demoRoute(request(demo))).status,503); }
  finally { if(prior===undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV=prior; }
});

test("client rejects 200 without accepted outcome, retains payload and reuses retry identity",async()=>{
  const payload={...demo}; const attempt={}; const requests=[];
  const fail=async(url,options)=>{requests.push(JSON.parse(options.body));return Response.json({ok:true});};
  await assert.rejects(()=>submitEnquiry("/api/demo-request",payload,attempt,fail),/confirm delivery/);
  await assert.rejects(()=>submitEnquiry("/api/demo-request",payload,attempt,fail));
  assert.deepEqual(payload,demo);assert.equal(requests[0].submissionId,requests[1].submissionId);
  const result=await submitEnquiry("/api/demo-request",payload,attempt,async()=>Response.json({ok:true,outcome:"accepted"}));
  assert.equal(result.ok,true);
});

test("actual route adapters: Resend acknowledgement/error and GHL fallback use fixed destinations and reply_to",async()=>{
  const names=["VERCEL_ENV","RESEND_API_KEY","EMAIL_FROM","EMAIL_TO","GHL_WEBHOOK_URL"];
  const previous=Object.fromEntries(names.map(name=>[name,process.env[name]]));
  const originalFetch=globalThis.fetch;
  Object.assign(process.env,{VERCEL_ENV:"development",RESEND_API_KEY:"re_synthetic_only",EMAIL_FROM:"Example <sender@example.com>",EMAIL_TO:"owner@example.com"});
  delete process.env.GHL_WEBHOOK_URL;
  try {
    for(const route of [contactRoute,demoRoute]) {
      const payload=route===contactRoute?contact:demo;
      globalThis.fetch=async(url,options)=>{
        assert.equal(String(url),"https://api.resend.com/emails");
        const mail=JSON.parse(options.body);
        assert.equal(mail.from,"Example <sender@example.com>");
        assert.equal(mail.to,"owner@example.com");
        assert.equal(mail.reply_to,"test@example.com");
        assert.ok(new Headers(options.headers).get("Idempotency-Key"));
        return Response.json({id:"synthetic-provider-id"});
      };
      assert.equal((await route(request(payload))).status,200);
      globalThis.fetch=async()=>Response.json({name:"validation_error",message:"private diagnostic"},{status:422});
      assert.equal((await route(request(payload))).status,502);
    }
    process.env.GHL_WEBHOOK_URL=webhookUrl;
    const calls=[];
    globalThis.fetch=async(url)=>{calls.push(String(url));return String(url)===webhookUrl?new Response("Rejected",{status:400}):Response.json({id:"fallback-id"});};
    assert.equal((await demoRoute(request(demo))).status,200);
    assert.deepEqual(calls,[webhookUrl,"https://api.resend.com/emails"]);
  } finally {
    globalThis.fetch=originalFetch;
    for(const [name,value] of Object.entries(previous)) {if(value===undefined)delete process.env[name];else process.env[name]=value;}
  }
});
