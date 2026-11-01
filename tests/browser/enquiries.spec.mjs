import { test, expect } from "@playwright/test";

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


test("direct-email enquiry keeps details, optional fields and service context", async ({ page }) => {
  let submissions = 0;
  await page.route("**/api/sendEmail", async route => { submissions++; await route.abort(); });
  await page.goto("/contact?service=seo#project-enquiry");
  await expect(page.getByLabel("What can we help with?")).toHaveValue("seo");
  await expect(page.getByLabel("Business (optional)", { exact: true })).not.toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Synthetic Reviewer");
  await page.getByLabel("Email", { exact: true }).fill("reviewer@example.com");
  await page.getByLabel("What would you like to build or improve? (optional)").fill("A clearer local service website.");
  await page.getByText("Add business, phone, budget or timing", { exact: false }).click();
  await page.getByLabel("Business (optional)", { exact: true }).fill("Example Studio");
  await page.getByRole("button", { name: "Open email draft" }).click();
  await expect(page.getByRole("status")).toContainText("press Send there");
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Synthetic Reviewer");
  expect(submissions).toBe(0);
});

test("copy-brief fallback preserves the enquiry when clipboard is unavailable", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("Unavailable"); } } }));
  await page.goto("/contact?service=web-development");
  await page.getByLabel("Name", { exact: true }).fill("Synthetic Reviewer");
  await page.getByLabel("Email", { exact: true }).fill("reviewer@example.com");
  await page.getByRole("button", { name: "Copy brief", exact: true }).click();
  await expect(page.getByLabel("Copy your brief", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Copy your brief", { exact: true })).toHaveValue(/Interested in: Web development/);
  await expect(page.getByRole("status")).toContainText("Select and copy");
});

test("project CTA opens the brief and remains visible without motion", async ({ page }) => {
  await page.goto("/projects");
  const cta = page.getByRole("region", { name: "Have a project in mind? Let's make a plan." });
  const link = cta.getByRole("link", { name: "Start your project" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/contact#project-enquiry$/);
  await expect(page.getByRole("form", { name: "Project enquiry" })).toBeVisible();
});


for (const path of ["/ai-receptionist#demo", "/lp/ai-receptionist-google#lp-demo", "/lp/ai-receptionist-meta#lp-demo"]) test(`demo enquiry uses direct email on ${path}`, async ({ page }) => {
  let submissions = 0;
  await page.route("**/api/demo-request", async route => { submissions++; await route.abort(); });
  await page.goto(path);
  await expect(page.getByLabel("What can we help with?")).toHaveValue("ai-receptionist");
  await page.getByLabel("Name", { exact: true }).fill("Synthetic Reviewer");
  await page.getByLabel("Email", { exact: true }).fill("reviewer@example.com");
  await page.getByRole("button", { name: "Open demo email" }).click();
  await expect(page.getByRole("status")).toContainText("press Send there");
  expect(submissions).toBe(0);
});
