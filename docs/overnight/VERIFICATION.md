# Verification evidence

2026-11-01, America/Toronto. Node 22.23.3, npm 10.9.9, Next 14.2.35, macOS arm64.

Story: service CTA → preselected enquiry form → validated API → delivery provider → explicit acceptance or recoverable error. Providers are mocked; live inbox delivery is a separate release gate.

| Boundary | Result | Evidence |
| --- | --- | --- |
| Lockfile install | PASS | `npm ci --no-audit --no-fund` baseline; Playwright added with lockfile |
| Production build | PASS | `npm run build`; no credentials required |
| Lint | PASS with 2 warnings | Existing layout font link and analytics fallback image; a missing ESLint config was added so the script runs non-interactively |
| API/provider contract | PASS | `npm test`: 20 Node tests; no live provider calls |
| UI → API → UI | PASS | 11 Chromium tests: pending, retained input, retry, explicit acceptance, false-200 rejection, actual missing-config routes, service CTAs, keyboard menu/FAQ |
| Responsive layouts | PASS | Home, service index, 3 service details, project index, 2 case studies, contact and AI offer at 320/390/768/1440px; one h1, no horizontal overflow or broken loaded images |
| SEO audit regression | PASS | 7 Python tests |
| Rendered production metadata | PASS | 33 sitemap pages; 0 errors, 0 warnings |
| Internal links | PASS | 42 unique internal targets across 33 sitemap pages; no broken route or fragment |
| Public redirect checks | PASS | Apex home/contact/legacy service path return 308 to www; query retained. Public robots and sitemap return 200 |
| Browser errors | PASS | No page errors captured during representative local navigation |
| Visual review | PASS | Desktop service page, mobile contact/error, existing brand and labelled fixture capture reviewed |
| Provider configured / accepted / inbox received | BLOCKED / NOT TESTED / UNVERIFIED | No usable approved sender/recipient configuration was established; no live enquiry sent |

Baseline before edits: 6 contact tests + 7 Python tests passed; production build passed; 33 sitemap pages had no metadata errors/warnings. The initial lint script had no config and opened an interactive setup prompt. Two warnings surfaced once the existing rules were configured; these warning locations predate this change.

Initial browser-test failures were selector ambiguity with Next's separate route-announcer alert; form-specific assertions fixed the test. A misplaced keyboard hook introduced during editing was caught by lint and corrected before the passing build. No failed required check was suppressed.

## Measured local navigation

Single browser run, Chromium 156, 1440×1000, reduced-motion preference, no CPU/network throttling. Same browser context (later pages benefit from warm cache). These measurements are lab navigation observations, not Lighthouse scores, field Core Web Vitals, performance improvements or conversion evidence.

| Page | Response start | DOM content loaded | Load |
| --- | ---: | ---: | ---: |
| Home | 85 ms | 285 ms | 828 ms |
| Web development | 4 ms | 32 ms | 32 ms |
| Contact | 3 ms | 29 ms | 29 ms |
| RateFamily | 7 ms | 32 ms | 260 ms |
| Insurimple case study | 6 ms | 22 ms | 253 ms |

Screenshots, raw measurements and product captures are in the owner's local outputs. Insurimple capture is a local fixture view, not production. Browser automation used Chromium only; no Safari/Firefox run or field-performance measurement was made.

The implementation preview reached READY. Authenticated reads returned the contact form (200), noindex metadata/header and `robots.txt` disallowing all crawling. Initial remote CI found a missing optional TypeScript peer lock entry; the original locked entry was restored without upgrading it. Final CI results are recorded in the local morning report. Production has not been merged or deployed by this task.
