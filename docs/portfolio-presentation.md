# Portfolio presentation — 1 November 2026

The homepage and portfolio bring TopRates, LifeRate, TermRates, HealthRate and Insurimple into one compact grid. Smaller actual interface captures, concise descriptions and direct visit/case-study links make the full range visible together. A sixth tile provides the project enquiry link. Both case studies include a large product capture and a concise project brief. Shared portfolio content keeps the homepage and index consistent. The navigation, hero and footer identify the destination as Portfolio.

The work remains identified as owned and built in-house. RateFamily's public websites and separate V2 development application retain distinct statuses. Insurimple remains in development, with synthetic demonstration data. No traffic, conversion, client, certification or production-security claims were added. Existing detailed evidence is in `overnight/CLAIMS_AUDIT.md`; this presentation builds on that verified scope.

## Capture provenance

| File | Source | Status and use |
| --- | --- | --- |
| `public/projects/toprates-public-20261101.png` | Actual public TopRates homepage captured 2026-11-01 | Owner-operated website; used to demonstrate navigation, visual identity and content structure. Full unmodified viewport, not a claimed new stock-asset licence. |
| `public/projects/liferate-public-20261101.jpg` | Actual public LifeRate homepage captured 2026-11-01 | Owner-operated public website; unmodified browser capture. |
| `public/projects/termrates-public-20261101.jpg` | Actual public TermRates homepage captured 2026-11-01 | Owner-operated public website; illustrative rates within a dated interface capture, not current financial offers. |
| `public/projects/healthrate-public-20261101.jpg` | Actual public HealthRate homepage captured 2026-11-01 | Owner-operated educational website; unmodified browser capture. |
| `public/projects/insurimple-demo-20261101.png` | Actual local Insurimple development activities UI captured 2026-11-01 in fixture mode | Synthetic records; visible development/fixture labels and an adjacent demo caption. No live customer data or private implementation files included. The internal fixture clock differs from the capture date. |

Source screenshots are unmodified. Next.js Image serves responsive, optimized variants; dimensions reserve layout space and off-screen images load lazily. The cards link to the relevant detailed case study, where the large TopRates and Insurimple captures also link to their original files. Card thumbnails use CSS framing. No capture is a generated mockup.

The presentation components render on the server with no new client state, dependencies, trackers or API changes. Validation includes the production build, the existing browser suite at four widths, rendered metadata and visual desktop/mobile review. Final deployment evidence is recorded in the local owner handoff and PR checks.
