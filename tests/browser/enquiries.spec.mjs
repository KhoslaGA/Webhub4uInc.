import { test, expect } from "@playwright/test";

async function fillContact(page) {
  await page.getByLabel("Name", { exact: true }).fill("Synthetic Reviewer");
  await page.getByLabel("Email", { exact: true }).fill("reviewer@example.com");
  await page.getByLabel("Tell us a bit more").fill("Synthetic verification only.");
}
async function fillDemo(page) {
  await page.getByLabel("Name", { exact: true }).fill("Synthetic Reviewer");
  await page.getByLabel("Phone", { exact: true }).fill("416 555 0100");
}
for (const flow of [
  {path:"/contact?service=seo",api:"**/api/sendEmail",button:"Send message",fill:fillContact},
  {path:"/ai-receptionist#demo",api:"**/api/demo-request",button:"Request a demo",fill:fillDemo},
]) {
  test(`${flow.path}: pending, failure retains input, retry and accepted success`, async ({page}) => {
    let count=0; let release;
    const gate=new Promise(resolve=>{release=resolve;});
    await page.route(flow.api,async route=>{
      count++;
      if(count===1) { await gate; await route.fulfill({status:502,json:{ok:false,outcome:"rejected",error:"Synthetic rejection. Please retry."}}); }
      else await route.fulfill({status:200,json:{ok:true,outcome:"accepted"}});
    });
    await page.goto(flow.path);
    await flow.fill(page);
    const button=page.getByRole("button",{name:flow.button,exact:true});
    await button.click();
    await expect(page.getByRole("button",{name:"Sending…",exact:true})).toBeDisabled();
    await expect(page.getByRole("status")).toContainText("Sending your request");
    expect(count).toBe(1);release();
    await expect(page.locator("form").getByRole("alert")).toContainText("Synthetic rejection");
    await expect(page.getByLabel("Name",{exact:true})).toHaveValue("Synthetic Reviewer");
    await expect(button).toBeEnabled();await button.click();
    await expect(page.getByRole("status")).toContainText("accepted for delivery");
    expect(count).toBe(2);
  });
  test(`${flow.path}: HTTP 200 without acceptance cannot show success`,async({page})=>{
    await page.route(flow.api,route=>route.fulfill({status:200,json:{ok:true}}));
    await page.goto(flow.path);await flow.fill(page);await page.getByRole("button",{name:flow.button,exact:true}).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("couldn't confirm delivery");
    await expect(page.getByLabel("Name",{exact:true})).toHaveValue("Synthetic Reviewer");
  });
}

test("all three service CTAs preserve preselection and invalid queries are safe",async({page})=>{
  for(const service of ["web-development","seo","custom-software-development"]) {
    await page.goto(`/services/${service}`);
    await page.getByRole("link",{name:"Discuss your project"}).last().click();
    await expect(page.getByLabel("What can we help with?")).toHaveValue(service);
  }
  await page.goto("/contact?service=%3Cscript%3Ebad%3C/script%3E");
  await expect(page.getByLabel("What can we help with?")).toHaveValue("not-sure");
});

test("actual unconfigured APIs fail closed and reject unsupported methods and oversized requests",async({request})=>{
  for(const path of ["/api/sendEmail","/api/demo-request"]) {
    const response=await request.post(path,{data:{name:"Synthetic Reviewer",email:"reviewer@example.com",phone:"4165550100"}});
    expect(response.status()).toBe(503);expect((await response.json()).ok).toBe(false);
    expect((await request.get(path)).status()).toBe(405);
    expect((await request.post(path,{data:{extra:"x".repeat(17000)}})).status()).toBe(413);
  }
});

test("keyboard menu and service FAQ are operable",async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto("/services/seo");
  const menu=page.getByRole("button",{name:"Toggle menu"});await menu.focus();await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded","true");await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded","false");
  const question=page.getByText("Can you guarantee a first-page ranking?",{exact:true});await question.focus();await page.keyboard.press("Enter");
  await expect(page.getByText(/^No\. Search results depend/)).toBeVisible();
});

for(const width of [320,390,768,1440]) test(`key pages have no horizontal overflow at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const path of ["/","/services","/services/web-development","/services/seo","/services/custom-software-development","/projects","/projects/rate-family","/projects/insurimple","/contact","/ai-receptionist"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    expect(overflow,`${path} overflow at ${width}`).toBe(false);
    const broken=await page.locator("img").evaluateAll(images=>images.filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.src));
    expect(broken).toEqual([]);
  }
});
