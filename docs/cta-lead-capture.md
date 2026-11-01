# CTA and direct-email enquiries — 1 November 2026

The owner selected direct email for now after a metadata-only Vercel environment check returned no project variables and zero hidden production variables. No credentials, environment settings, recipients or DNS were changed.

## Visitor flow

- Navigation, homepage and portfolio CTAs say **Start your project** and lead straight to the enquiry form.
- The closing CTA presents a concrete next step and a telephone alternative. Its copy and actions are visible immediately, without scroll-reveal dependencies; the existing globe remains.
- The short contact form requires name and email. Business, phone, budget and timing are optional and collapsed. Service-page selection is preserved.
- **Open email draft** prepares a properly encoded message addressed to the canonical business email. The visitor reviews and sends it in their email app. No website submission, inbox receipt or booking is claimed.
- **Copy brief** supports visitors without a configured email handler. If clipboard access fails, the prepared text is revealed and selected for manual copying. Direct email and telephone links remain available.
- Demo and ad-landing forms use the same direct-email flow, retaining their AI receptionist purpose and originating page in the draft. Opening a draft never fires a Lead conversion.
- No draft is stored in cookies or browser storage. No lead data is posted to the website. Existing provider routes remain dormant, fail closed without configuration, and retain unit coverage for a future integration.

## Verification

Production build, 23 Node tests, 13 browser tests, and the 33-page rendered metadata audit. Browser coverage includes the direct-email handoff with no API submission, service preselection, all three demo pages, clipboard failure recovery, CTA navigation, and responsive overflow checks. Desktop/mobile visual review covers the form and closing CTA. Testing uses synthetic details and does not send an email.

Direct email depends on the visitor completing the send. Automated delivery and confirmed inbox receipt remain separate future work.
