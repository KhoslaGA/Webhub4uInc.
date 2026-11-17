# feat(real-estate): cinematic property sites — Phase 1 (engine + page)

Branch: `feat/cinematic-property-sites` → `main`. A person reviews and merges. Implements Phase 1 (sections 1–5) of `docs/real-estate-cinematic/PLAN.md`. Phase 2 and Phase 3 are not included.

## Summary

- **`ScrollSequence`**: a client component that scrubs a WebP frame sequence on a sticky `<canvas>` as the visitor scrolls (GSAP ScrollTrigger, which already ships with the site). The first frame loads immediately and the rest load progressively, coarse to fine. Until a frame loads, the canvas draws the nearest frame that has.
- **`scripts/frames.mjs`**: uses system ffmpeg to turn a clip into desktop and mobile frames, a poster, an H.264 fallback and `manifest.json`. `scripts/test_frames.mjs` covers it.
- **`/real-estate-websites`**: a server-rendered conversion page. It is **`noindex` and absent from the sitemap** while `REAL_ESTATE.indexable` is `false`. The demo section renders only when `public/demos/<demoSlug>/manifest.json` exists at build time. Otherwise the page shows a static explainer, never an empty canvas.
- **Wiring**: a `REAL_ESTATE` flag in `business.js`, a `real-estate-websites` entry in `SERVICES`, a contact-form preset, a city-page guard against null prices, and the sitemap gate.

No prices are published (`priceFrom: null`), and nothing claims a client, result or testimonial. The demo is labelled as a concept wherever it renders.

## Files changed

| File | Change |
|---|---|
| `src/components/sections/new/ScrollSequence.js` (+ `.module.css`) | New. Canvas engine. |
| `scripts/frames.mjs` | New. Frames pipeline CLI. |
| `scripts/test_frames.mjs` | New. `node --test`, picked up by the existing `npm test` glob. |
| `src/app/real-estate-websites/page.js` | New. Server-component page. |
| `src/components/sections/new/RealEstatePage.module.css` | New. Lives beside the other page modules, as with `AiReceptionistPage.module.css`. |
| `src/components/sections/new/PageHero.js` | Optional `children` slot, rendered under `sub`, used here for the CTA row. Existing callers are unchanged. |
| `src/lib/business.js` | `REAL_ESTATE = { indexable: false, demoSlug: "concept-villa", demoCaption, priceFrom: null }` |
| `src/data/services.js` | `real-estate-websites` entry. `priceFrom` and `listed` both come from `REAL_ESTATE`. |
| `src/app/locations/[city]/page.js` | Skips services with `listed: false`. Renders "from …" only when `priceFrom` is truthy. |
| `src/lib/contactOptions.mjs` | Adds the `real-estate-websites` option ("Property walkthrough website") so `/contact?service=real-estate-websites` preselects it and the APIs accept it. |
| `src/app/sitemap.js` | Includes `/real-estate-websites` only when `REAL_ESTATE.indexable` is `true`. |

`SERVICES` has one consumer, `src/app/locations/[city]/page.js`. `getService` is exported but nothing calls it. No other file reads `priceFrom`.

## ScrollSequence guards

- Canvas backing store DPR is capped at `Math.min(devicePixelRatio, 1.5)`.
- An IntersectionObserver (rootMargin 50%) stops both drawing and new frame downloads while the section is off-screen.
- With `prefers-reduced-motion`, there is no canvas and no frame downloads. The page shows the poster and a `<video controls muted playsInline preload="none">` fallback. CSS collapses the 300vh scroll length before JS runs.
- On unmount: `ScrollTrigger.kill()`, observers disconnected, fetch aborted, RAF cancelled, image `src` removed.
- Resize: a ResizeObserver re-sizes the canvas and redraws with cover-fit.
- The caption is always visible as a mono label: bottom-left, or top-left in static mode so it stays clear of the video controls.
- No new dependencies.

## How to generate a demo

```bash
# 1. Produce a short clip (operator gate 1 below), then:
node scripts/frames.mjs path/to/clip.mp4 concept-villa
#    options: --fps 24 --width 1920 --mobile-width 900 --quality 72 [--out public/demos]
#    replaces public/demos/concept-villa/ and prints the payload size (warns above 25 MB desktop)

# 2. Check REAL_ESTATE.demoCaption in src/lib/business.js matches the clip
#    (default: "Concept rendering · not a client property").

# 3. Rebuild. The demo section appears only when the manifest exists at build time.
npm run build && npx next start
```

Output: `f_0001.webp …`, `m/f_0001.webp …`, `poster.webp`, `fallback.mp4` and `manifest.json` `{ slug, count, width, height, frames, framesMobile, poster, video }`, with paths relative to the manifest. `FFMPEG_PATH` overrides the binary. The script exits with code 2 and a clear message if ffmpeg is missing, the input is missing or the slug is invalid.

## Verification (run in the Claude Code sandbox, 2026-11-17)

| Command / check | Outcome |
|---|---|
| `npm ci --no-audit --no-fund` | OK. `package-lock.json` unchanged, so no lockfile commit. |
| `npm test` | 25 tests, 25 pass, 0 fail, 0 skipped (was 23 before this branch) |
| `FFMPEG_PATH=/nonexistent/ffmpeg node --test scripts/test_frames.mjs` | 1 pass, 1 skipped ("ffmpeg not installed") |
| `npm run build` | Exit 0. `○ /real-estate-websites 4.25 kB / 155 kB` first load. Lint warnings: only the two existing ones (`layout.js` custom font, `Analytics.js` `<img>`). |
| `python3 -m unittest discover -s scripts -p 'test_*.py'` | 7 tests OK |
| `python3 scripts/seo_audit.py --build-dir .next/server/app` | 33 sitemap pages, 0 errors, 0 warnings |
| Browser suite, `tests/browser/enquiries.spec.mjs` | 13/13 pass. Run against the sandbox's Chrome for Testing 153 through a scratch config that only sets `launchOptions.executablePath`. Playwright's bundled Chromium is not installed here, so `npm run test:browser` itself was not run. |

**With demo assets.** `ffmpeg -f lavfi -i testsrc=duration=3:size=1280x720:rate=24 -pix_fmt yuv420p clip.mp4`, then `node scripts/frames.mjs clip.mp4 concept-villa` produced 72 frames at 1280×720: desktop 0.62 MB, mobile 0.48 MB, mp4 0.03 MB. Then `npx next build && npx next start -p 3100`:

- `curl /real-estate-websites` returns 200 with "Concept demo", the sequence `<canvas>`, the poster `<img src="/demos/concept-villa/poster.webp">`, the caption and `--seq-h:300vh`. The static explainer is absent.
- `manifest.json`, `poster.webp`, `f_0001/f_0072.webp`, `m/f_0072.webp` and `fallback.mp4` all return 200 with the correct content types.
- Headless Chrome, 1280×800: the canvas became ready. Mid-scroll drew `f_0045` of 72, which is expected around the middle. All 72 desktop frames were fetched and no mobile frames. Draw count stayed at 23 while scrolling 1,200px further past the section (off-screen pause works). The caption is visible.
- Headless Chrome, 390×844 at DPR 3: all 72 mobile frames were fetched and no desktop frames. Canvas backing was 585×1266, i.e. DPR capped at 1.5. No horizontal overflow.
- Headless Chrome, reduced motion: 0 sequence canvases, 0 frames requested, 0 draws. A video with `fallback.mp4`, the poster and controls (no autoplay). Section height 680px. Hero CTA and caption visible.

**Without demo assets.** `rm -rf public/demos/concept-villa`, then rebuild and restart:

- `curl` returns 200 with the explainer ("How the walkthrough behaves") and no `ScrollSequence` markup, `/demos/` references or "Concept demo". `manifest.json` returns 404.
- Headless Chrome: 0 sequence canvases, 0 `/demos/` requests, explainer visible. No horizontal overflow at 320, 390, 768 or 1440px.

**Both states:**

- Page HTML has `<meta name="robots" content="noindex, follow"/>`, the canonical `https://www.webhub4u.com/real-estate-websites` and the planned title.
- `/sitemap.xml` has 33 `<loc>` entries, none of them `/real-estate-websites`.
- `/locations/brampton` renders the same five priced cards as before, with no real-estate card and no "null" or "undefined" text.
- `/contact?service=real-estate-websites#project-enquiry` preselects "Property walkthrough website".
- Console: the only error was a failed Google Fonts stylesheet request (`ERR_TUNNEL_CONNECTION_FAILED`). The sandbox network blocks that request, and it fails the same way on `/ai-receptionist`. The new code logged no errors.

No generated frames or videos are committed (`public/demos/` does not exist on this branch).

**Lighthouse: the ≥90 criterion is not met in this measurement.** Lighthouse 12.8.2 via `npx`, mobile form factor, simulated throttling (150 ms RTT, ~1.6 Mbps, 4× CPU), against `next start` on localhost, page without the demo, Google Fonts blocked:

| Page | Perf | LCP | TBT | CLS | Sandbox benchmarkIndex |
|---|---|---|---|---|---|
| `/real-estate-websites` | **56** | 4.2 s | 4,760 ms | 0 | ~2050 |
| `/ai-receptionist` (existing baseline, same conditions) | 49 | 4.2 s | 8,050 ms | — | ~1640 |

Most of the main-thread time is in shared, pre-existing code: the three.js chunk (~870 ms scripting) loaded by `ConstellationBg` in `PageHero` and `LogoGlobe` in `CtaNew`, and the shared app chunk. The page's own chunk is about 10 KB. These are single sandbox runs, not a production measurement. Re-measure on the Vercel preview. Reaching 90 likely means deferring or dropping the WebGL backgrounds on this page, which changes shared components and is left for a decision.

## Operator gates (Gautam: Claude Code does not do these)

1. Produce the first walkthrough clip (Higgsfield or equivalent), either from a real property you have rights to or as a captioned concept rendering. Check the tool's commercial-use terms and per-clip cost first.
2. Run `node scripts/frames.mjs <clip> concept-villa`, commit the frames, and review on the Vercel preview. Set `REAL_ESTATE.demoCaption` so it is accurate for that clip.
3. Set `REAL_ESTATE.priceFrom`, or leave it null, and flip `indexable: true`. That one flag removes `noindex`, adds the route to the sitemap and lists the service on the city pages.
4. Review and merge this PR.

Labelling note for gate 1: if a real listing's walkthrough is produced by an image-to-video tool, the motion and in-between frames are generated. The page copy says software-generated motion or frames carry a visible label, so the caption on that clip has to say so.
