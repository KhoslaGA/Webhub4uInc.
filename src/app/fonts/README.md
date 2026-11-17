# Inter font provenance

`InterVariable.woff2` is an unmodified upstream Inter variable font, by The Inter Project Authors, distributed under the SIL Open Font License 1.1 in `LICENSE.txt`.

- Source: https://github.com/rsms/inter/blob/353b61b9f4430d5f420d56605a6e7993e0941470/docs/font-files/InterVariable.woff2
- Upstream commit: `353b61b9f4430d5f420d56605a6e7993e0941470`
- Retrieved: 2026-11-01
- SHA-256: `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`
- Size: 352,240 bytes; full variable font, retaining its original glyph coverage.

The existing Inter family is loaded through `next/font/local` so builds do not depend on Google Fonts returning a URL with a file extension. GitHub CI exposed the existing loader's null-match failure, matching [Next.js issue #99114](https://github.com/vercel/next.js/issues/99114). The established Fraunces/Geist stylesheet remains unchanged. This does not add a new font family or upgrade Next.js.

# Fraunces and Geist (design-system fonts)

Self-hosted through `next/font/local` in `src/app/layout.js` (replacing the Google Fonts stylesheet, which was render-blocking). Files are unmodified copies taken from the npm packages below; each is distributed under the SIL Open Font License 1.1 (licence texts alongside).

| File | Source | Axes | Size | SHA-256 |
|---|---|---|---|---|
| `Fraunces-Variable.woff2` | `@fontsource-variable/fraunces@5.3.0` → `files/fraunces-latin-opsz-normal.woff2` | opsz 9–144, wght 100–900 | 67,304 B | `7234ed860a9cc83045413c4faee63c960a8f2d1917adcf728119307d56e0d783` |
| `Fraunces-Variable-Italic.woff2` | `@fontsource-variable/fraunces@5.3.0` → `files/fraunces-latin-opsz-italic.woff2` | opsz 9–144, wght 100–900 | 81,520 B | `066710ce7ed235a339d3d6cdcc8b55c0bea5632232662d83aacea25852108271` |
| `Geist-Variable.woff2` | `geist@1.9.2` → `dist/fonts/geist-sans/Geist-Variable.woff2` | wght 100–900 | 69,488 B | `3626eba547294501c8a4d662c7d9ea3b49734409a4c5a1ccf12fa86429b1687e` |

- Licences: `LICENSE-Fraunces.txt` (The Fraunces Project Authors), `LICENSE-Geist.txt` (Vercel, with basement.studio).
- Retrieved: 2026-11-17.
- Fraunces is the Latin subset, matching what the previous Google Fonts request served for this site's English content.
