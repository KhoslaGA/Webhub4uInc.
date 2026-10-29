# Service pages and portfolio-led homepage — 29 October 2026

## Delivered

- Three substantial static service routes: `/services/web-development`, `/services/seo`, `/services/custom-software-development`. Unique copy, metadata, Open Graph URLs, Service and Breadcrumb schema, deliverables, process, measurement guidance, relevant case studies, FAQs and enquiry links.
- Existing logo, azure/navy visual system and homepage 3D artwork retained. Homepage now leads with web development, SEO and custom software, followed by RateFamily and Insurimple as owned projects. Illustrative Insurimple workflow is explicitly labelled; no stock scene represents our staff or product UI.
- Shared service data drives the homepage grid, service detail routes and sitemap. Services index, navigation, footer and existing location service links lead to the new pages. Known web-design and local-seo aliases redirect to the new destinations; unknown detail paths return 404.
- The contact form carries service intent from its URL, asks optional budget/timing questions and retains entered details after failure. All form fields are bounded; email payload is plain text. Missing email configuration returns 503, provider rejection returns 502, and success requires a provider acceptance ID. Personal enquiry payloads are no longer logged by this endpoint.
- Six contact-handler tests cover success, provider failures, missing configuration, malformed fields/JSON and HTML-like input. CI runs them alongside the existing seven SEO-audit tests.
- Broad process/FAQ delivery promises now refer to agreed scope and dependencies. Published package prices and contact details remain unchanged pending reconciliation.

## Validation

Run `node --test scripts/test_contact.mjs`, `python -m unittest discover -s scripts -p 'test_*.py'`, `npm run build`, then `python scripts/seo_audit.py --build-dir .next/server/app`.

Validation completed: clean production build; six enquiry-handler tests and seven SEO-audit tests passed; all 33 prerendered sitemap pages passed with zero errors/warnings. Browser checks covered desktop and 390px iframe layouts, menu navigation, service preselection, FAQ expansion, the unconfigured-mail error with input retention, both legacy redirects and the unknown-service missing-page screen. The desktop homepage, narrow homepage, narrow service detail and narrow contact page showed no horizontal overflow. The executor could not reach the browser-only preview origin for the separate HTTP crawler, so that full HTTP audit was not completed.

The audit covers 33 sitemap pages. Build-time metadata checks do not establish rankings or conversion gains. The preview must have RESEND_API_KEY unset for non-delivering form tests; unit tests inject a fake email provider. Real mailbox delivery still needs a configured provider and an explicitly authorised live test.

## Photography follow-up

Depositphotos replaces the previous free-stock preference. Selected assets are listed below; downloading/licensing completion is not confirmed. Do not add watermarked previews or remote stock URLs to the website. Once the licensed originals are available, record the licence/download evidence, create responsive local WebP/AVIF versions, and inspect crops before integration.

| Asset | Placement | Source |
| --- | --- | --- |
| 75031817 · vichie81 | Toronto/GTA supporting banner | https://depositphotos.com/photo/toronto-skyline-at-dusk-75031817.html |
| 397950282 · zanottiarts | Web-development process | https://depositphotos.com/photo/website-designer-creative-planning-application-developer-development-draft-sketch-drawing-397950282.html |
| 204648590 · puhhha | Supporting service imagery / story | https://depositphotos.com/photo/web-design-team-designers-working-computer-office-developing-web-project-204648590.html |
| 742786224 · PeopleImages.com | Website-brief educational content | https://depositphotos.com/photo/hands-paper-notebook-top-view-desk-planning-writing-brainstorming-ideas-742786224.html |

Real RateFamily and Insurimple captures remain a separate evidence task. Keep Insurimple labelled in development until its release status is verified. No fabricated performance numbers or testimonials were added.

## Remaining scope

- Verify current business contact details and reconcile package/add-on prices across their existing sources.
- Add licensed photography and approved product screenshots.
- Confirm production mail configuration and test receipt with authorisation.
- Validate mobile layouts on physical devices and measure accessibility/Core Web Vitals.
- Review and merge via the existing repository process; no production deployment is included in this change.
