# Cinematic Property Sites — Claude Code Plan

Owner: Gautam (operator, approves) · Builder: Claude Code · Created 2026-11-17
Branch: `feat/cinematic-property-sites` off `main`. Never push to or merge into `main` — PR only, a person merges.

Read `CLAUDE.md` first. Every hard rule there applies (honesty, `.wh` tokens, server components by default, WebGL/canvas guards, env-gated features stay dormant, `npm run build` must pass, commit lockfile changes).

## Why

New Webhub niche: scroll-driven "camera walkthrough" websites for properties. Frames from a short video (made from real listing photos, or a labelled rendering for unbuilt projects) are scrubbed on a canvas as the visitor scrolls. Target buyers, in priority order:

1. Ontario cottage / short-term-rental operators — direct-booking site + monthly retainer (recurring revenue).
2. Custom builders and boutique developers — signature project site (long-lived asset).
3. Top-producing GTA realtor teams — per-listing walkthrough film + microsite (volume, proof).

## Non-negotiables for this niche

- **No misrepresentation of real property.** Walkthroughs of a real listing are built from its real photos. Any AI-generated or AI-staged frame is labelled on the page ("Virtual staging" / "Concept rendering"). Fully AI-generated sequences are allowed only for unbuilt projects and must be captioned as renderings. (RECO/TRESA advertising rules, Competition Act.)
- **Demos are labelled concepts**, never presented as client work. No invented clients, metrics, prices-paid or testimonials.
- **Pricing is not published** until Gautam sets it in `src/lib/business.js`. Until then the page says "Scoped per property — request a free preview".
- **The page ships `noindex`** until at least one real demo sequence exists. Flip it via a single flag.

---

## Phase 1 — Engine + page (Claude Code, this PR)

### 1. `ScrollSequence` component
`src/components/sections/new/ScrollSequence.js` + `ScrollSequence.module.css`

- `"use client"`. Props: `manifestUrl` (JSON), `caption` (required string — the label shown, e.g. "Concept rendering"), `heightVh` (scroll length, default 300), `children` (overlay copy, optional).
- Sticky full-viewport `<canvas>`; GSAP `ScrollTrigger` (already registered in `SmoothScroll.js`) maps scroll progress → frame index; draw with `drawImage` using cover-fit math.
- Loading: fetch manifest → preload the first frame immediately (render it as poster), then the rest progressively; draw the nearest loaded frame while others load. Optional `framesMobile` list in the manifest used under 768px.
- Guards (mandatory): DPR capped at `Math.min(devicePixelRatio, 1.5)`; stop work when off-screen (IntersectionObserver); `prefers-reduced-motion` → no scrubbing, show the poster frame plus the `video` fallback if the manifest has one; kill the ScrollTrigger and release images on unmount; resize-safe.
- Caption is always visible (small mono label, bottom-left), not behind any animation.
- No new dependencies.

### 2. Frames pipeline script
`scripts/frames.mjs` (+ `scripts/test_frames.mjs` using `node --test`, matching the existing `npm test` glob)

- `node scripts/frames.mjs <input-video> <slug> [--fps 24] [--width 1920] [--mobile-width 900] [--quality 72]`
- Uses system `ffmpeg` via `child_process.spawn`; fail with a clear message if ffmpeg is missing.
- Writes `public/demos/<slug>/f_0001.webp …`, `public/demos/<slug>/m/f_0001.webp …` (mobile), a `poster.webp`, an H.264 `fallback.mp4` (`-preset veryfast`, `-crf 26`, `+faststart`, no audio), and `manifest.json`: `{ slug, count, width, height, frames: [...], framesMobile: [...], poster, video }`.
- Prints total payload size; warn above 25 MB desktop.
- Test: generate a 2-second synthetic clip with ffmpeg `testsrc`, run the script into a temp dir, assert manifest shape and frame count. Skip the test cleanly if ffmpeg is absent.

### 3. Page `/real-estate-websites`
`src/app/real-estate-websites/page.js` (server component) + `RealEstatePage.module.css`

Composition: `PageShell` → `PageHero` → sections. Follow existing money-page patterns (`/ai-receptionist`). Conversion page rules: no scroll-reveal on CTAs.

Sections:
1. **Hero** — eyebrow "Cinematic property websites"; headline with one `.wh-em` accent (e.g. "Let buyers *walk through* before they visit."); sub explaining photo-ordered walkthroughs; primary CTA "Get a free 15-second preview" → contact with service preset (use `ContactFormFromUrl` / existing query-param pattern), ghost CTA "How it works".
2. **Demo** — renders `ScrollSequence` only if `public/demos/<DEMO_SLUG>/manifest.json` exists at build time (check with `fs` in the server component). If absent, render a static explainer block instead — no empty canvas, no placeholder video.
3. **Who it's for** — three cards: Cottage & short-term rentals (direct bookings, booking-engine embed), Builders & developers (project sites that sell over 12–24 months), Realtor teams (listing walkthroughs that win listing appointments). Structural facts only.
4. **How it works** — 4 steps: send ordered photos → we produce the walkthrough → we build the site → launch and handover. Photo order = camera path.
5. **Honesty block** — short, plain: real listings use real photos; AI elements are labelled; renderings are captioned.
6. **FAQ** — reuse `FaqBlock`; questions on timelines, what photos are needed, mobile performance, booking-engine compatibility (Hostaway/Lodgify/OwnerRez embeds, scoped per client), labelling of AI imagery.
7. **CTA** — `CtaNew`.

Metadata: title "Cinematic Real Estate & Cottage Rental Websites | Webhub4U", description, canonical; `robots: { index: false }` while `REAL_ESTATE.indexable` is false.

### 4. Wiring
- `src/lib/business.js`: add `REAL_ESTATE = { indexable: false, demoSlug: "concept-villa", priceFrom: null }`. When `priceFrom` is null, no price renders anywhere.
- `src/data/services.js`: add a `real-estate-websites` entry (`href: "/real-estate-websites"`, `priceFrom` sourced from `REAL_ESTATE`, null-safe at every consumer).
- `sitemap.js`: include the route only when `indexable` is true.
- Do not add it to the main nav yet.

### 5. Acceptance criteria
- `npm run build` passes; `npm test` passes (frames test passes or skips cleanly without ffmpeg).
- `/real-estate-websites` renders with no demo assets present (fallback explainer) and with assets present (run the script on a synthetic `testsrc` clip into a throwaway slug locally to verify, then delete those generated frames — do not commit them).
- Reduced-motion: no scrubbing, poster visible, CTAs visible.
- No console errors; canvas stops drawing when scrolled off-screen.
- Lighthouse mobile on the page without the demo ≥ 90 performance (report the number and conditions; don't claim it otherwise).
- PR description lists: files changed, how to generate a demo, the operator gates below.

---

## Operator gates (Gautam — Claude Code must not do these)

1. Produce the first walkthrough clip (Higgsfield or equivalent) from a real property you have rights to, or a captioned concept rendering. Check the tool's commercial-use terms and per-clip cost first.
2. Run `node scripts/frames.mjs <clip> concept-villa`, commit the frames, review on the Vercel preview.
3. Set `REAL_ESTATE.priceFrom` (or leave null) and flip `indexable: true`.
4. Review and merge the PR.

## Phase 2 — Productize (next PRs, after Phase 1 merges)
- Three skins over the same engine: Cottage (warm, booking-first), Luxury listing (dark, editorial), Development (floor-by-floor chapters with `children` overlays).
- Booking-engine embed component, env-gated per client like `BookingEmbed`.
- Per-client microsite starter (`/templates/property-site`) so a new client is config + frames, not new code.

## Phase 3 — Go-to-market (operator + agents, not code)
- Outscraper list: ~300 Ontario cottage-rental operators and luxury GTA teams.
- Offer: free 15-second walkthrough of their own existing listing photos.
- Instagram reels of the build process with a comment-keyword funnel.
- Every sale becomes a reusable template variant.
