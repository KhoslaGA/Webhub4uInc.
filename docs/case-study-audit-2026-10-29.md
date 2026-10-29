# Case-study accuracy audit — 2026-10-29

Scope: `/projects/rate-family` and `/projects/insurimple`. Every public claim
was checked against code and tests at the commits below, not against READMEs
alone. This file is public (this repository is public): it records sources,
method and verdicts at the level the pages publish, and leaves out vendor
names, regions, credential formats, table names and partner names from the
private repositories.

## Sources

| Repository | Visibility | Commit | Role |
|---|---|---|---|
| KhoslaGA/Toprates | private | `59dd71313833ef5a07b2b9348ed69256ec0d5bae` (main, 2026-10-28) | Rate Family **production** network (all four live sites) |
| KhoslaGA/Rate-Family-V2 | public | `08b1967ca20ac5fdcea24972b74843e6c7ed055b` (2026-07-06) | Separate **development** app (mock data) |
| KhoslaGA/Insurimple-Platform | private | `230a8f5b7220fe5ffcc04348e07ecb86df9218fb` | Operations platform (CRM / Command Center) |
| KhoslaGA/Insurimpleplatform-backend | private | `617a63e52afe8bb252ee2a5905cbfcce8dd2a1f9` | BMS (system of record) |

Live behaviour of the four Rate Family sites was **not** observed in this
audit: the build sandbox's network policy blocks those domains. "Live" on the
page rests on the operator's own knowledge and browser.

## Rate Family — production network (Toprates @ 59dd713)

| Claim on page | Verdict | Method / evidence |
|---|---|---|
| 120+ page routes in one production app | **Supported, as route files** | `git ls-files \| grep -E '(^\|/)page\.tsx$'` → 122 files under `app/src/app/`: 109 static routes and 13 dynamic templates (e.g. `blog/[slug]`, `glossary/[slug]`, `insurance/auto/ontario/[city]`). 120 excluding the CMS studio and one dev-only route. These are **route files, not published URLs**: templates expand into many URLs, and host gating means some routes serve only one brand. Published-URL counts need the live sitemaps (not reachable from the sandbox). |
| 9 CMS document types | **Supported** | `app/sanity.config.ts` registers 11 schema types: 2 object types (`blockContent`, `figure`) and 9 document types — 6 editorial and brand-scoped through `siteField` (post, city page, glossary term, lab briefing, author, category) and 3 for form submissions (contact inquiry, waitlist entry, life referral). |
| 20+ automated check scripts | **Supported; "20" undercounted** | 26 `app/scripts/check-*.mjs` scripts (self-tests excluded). 22 of them run in `npm test` (the pre-merge gate, `npm run gate` = `npm test` + build gate); the other 4 are on-demand. `npm test` is 52 steps in total (checks, self-tests, render tests). **Ran it:** `SITEMAP_SANITY=snapshot NEXT_PUBLIC_SANITY_PROJECT_ID=<the repo's default> NEXT_PUBLIC_SANITY_DATASET=production npm test` → exit 0, all 52 steps (sandbox, snapshot dataset). The repo has no CI workflow: the gate runs before merges, not automatically. Every production build runs three assertions from `app/next.config.mjs` (site env, GA4 env, `check-sitemap-hosts.mjs`). |
| One app serves four brands, brand resolved from the domain | **Supported** | `app/src/middleware.ts` (`siteFromHost`), per-brand hosts in `app/src/site/config.ts`. |
| Canonicals / sitemaps / structured data from each brand's own host; build fails on a cross-host sitemap entry | **Supported** | `app/src/site/config.ts` hosts; `check-sitemap-hosts.mjs` executed from `next.config.mjs`, non-zero exit fails the build. |
| New URLs submitted to IndexNow after production deploys | **Supported** | `app/scripts/indexnow-ping.mjs` as `postbuild`; skips every non-production deploy. |
| Named guardrails (canonical ownership, noindex, mock-quote labelling, compensation and card claims, review attestation) | **Supported** | `check-canonical-ownership`, `check-noindex-robots`, `check-mock-quotes`, `check-compensation-claims`, `check-card-claims`, `check-review-attestation` — all in `npm test`. |
| "for a team of one" (previous wording) | **Not verifiable from code** | Softened to "a small team". |

## Rate Family V2 — development app (Rate-Family-V2 @ 08b1967)

| Claim on page | Verdict | Evidence |
|---|---|---|
| Next.js frontend + NestJS API + shared typed contracts | **Supported** | `app/`, `backend/apps/api`, `backend/packages/contracts`; app imports `@ratefamily/contracts` (e.g. `app/src/components/credit-cards/CompareGrid.tsx`). |
| Host theming | **Supported** | `html[data-site=…]` styles referenced from `app/src/app/layout.tsx`; `DESIGN-TOKEN-CONTRACT.md`. |
| Deterministic mock data; fixture offers carry a development-only source | **Supported** | README "Live vs. mock"; `DEV-FIXTURE` source URIs in `backend/apps/api/src/mock/catalog.data.ts`. |
| In production mode the API client rejects a mock-tier response missing its mock flag | **Supported (code)** | `app/src/lib/api/client.ts` header comment and guard. |
| No purchase or bind endpoint | **Supported by code; README's "test-asserted" is not** | No bind route exists; `backend/apps/api/src/leads/leads.module.ts` documents it. The only backend test file, `backend/apps/api/test/integration.test.mjs`, has no bind assertion, so the page does not claim one. |

V2 facts are presented in their own "In development" section and are never
used as evidence for the production network.

## Insurimple (Platform @ 230a8f5, BMS @ 617a63e)

Implementation and tests were read; the suites were **not run** (the BMS suite
needs PostgreSQL). Test-file counts at these commits: Platform 130 unit-test
files (+1 end-to-end spec); BMS 32 spec files. Counts are not published.

| Claim on page | Verdict | Evidence (repo-relative) |
|---|---|---|
| Platform handles CRM, opportunities and a single activity queue; BMS owns household/policy/renewal/quote; typed client validates responses | **Implemented + tested.** Old wording "tasks" was out of date (Task was merged into Activity); "defined API contracts" overstated a mirrored, unversioned contract → reworded. | Platform `packages/integrations/src/ports/bms.ts`, `packages/integrations/src/adapters/bms/client.ts`, `packages/services/src/bms.ts`; renewal-outcome contract pinned on both sides (Platform `bms-renewal-outcome-contract.test.ts`, BMS `test/renewal-outcome-contract.spec.ts`). |
| BMS: organisation from a signature-verified session or an organisation-bound credential | **Implemented + tested (BMS only)** | BMS `src/auth/auth.guard.ts`; `test/api.spec.ts` (wrong-key, expired, no-org, forged header), `test/writes.spec.ts` (credential cannot switch organisation). |
| Forced PostgreSQL row-level security on every tenant-scoped table | **Implemented + tested (BMS only)** | BMS `src/prisma/db-safety.ts` boot gate; `test/migrations.spec.ts` "RLS ENABLED and FORCED on every tenant-scoped table"; `test/rls.spec.ts`. The Platform's own database scopes by tenant in its repositories, not RLS — the page scopes this claim to the BMS. |
| Tenant-scoped keys stop cross-organisation references | **Implemented + tested** | BMS migrations (composite tenant foreign keys); `test/rls.spec.ts` "rejects a reference to a parent in another tenant (composite FK)". |
| Policy changes (bind, endorse, cancel, reinstate, renew, non-renew) append to an immutable ledger | **Implemented + tested** | BMS `src/policies/ledger.ts`; `test/bind.spec.ts` "…is append-only for every role". |
| Audit record + outbox event in the same transaction | **Implemented + tested for policy changes** (no fault-injection test) | BMS `test/servicing.spec.ts` "…audits and emits policy.endorsed, in one transaction"; `test/bind.spec.ts` "…audits and emits, together". Some non-policy writes are audited without an event; the page limits the claim to policy changes. |
| Every BMS write carries an idempotency key; retries replay | **Implemented + tested** | BMS `src/common/write-context.ts`, `src/common/idempotency.ts`; `test/writes.spec.ts` "replays on the same key"; `test/bind.spec.ts` "replays… and refuses the same key with a different body". |
| AI reads and proposes; nothing executes without a person's confirmation | **Implemented + tested** | Platform `packages/ai/src/lifecycle.ts`, `packages/services/src/proposals.ts`; `packages/ai/src/__tests__/lifecycle.test.ts` "cannot execute without a human confirmation"; `tools.test.ts` "the toolset only ever calls read methods on the ports", "the ai package depends on no persistence or service package". |
| Non-production builds show a data-mode label (e.g. FIXTURE DATA) | **Implemented, label not tested** | Platform `apps/command-center/src/components/AppShell.tsx` badge (`{dataMode.toUpperCase()} DATA`). |
| Sandbox verification passed 30 Sep 2026, incl. no-bypass role check and RLS tests | **Documented measurement** | BMS `docs/roadmap.md` (2026-09-30 entry: verify run PASS); `scripts/sandbox-verify.sh` steps 4 (no role has BYPASSRLS) and 8 (RLS suite). Not re-run in this audit. |
| Not in production use; real-data intake locked | **Supported** | Platform `docs/lead-intake.md` (real-data release `locked` on every deployment); BMS import is synthetic-only. No evidence of real customers. |

## Not published, by design

Internal-only details found during the audit stay out of the pages and this
file's prose: hosting/identity/cloud vendors, deployment regions, credential
formats, database role and table names, partner and agreement names, and
internal process incidents.
