# Inter font provenance

`InterVariable.woff2` is an unmodified upstream Inter variable font, by The Inter Project Authors, distributed under the SIL Open Font License 1.1 in `LICENSE.txt`.

- Source: https://github.com/rsms/inter/blob/353b61b9f4430d5f420d56605a6e7993e0941470/docs/font-files/InterVariable.woff2
- Upstream commit: `353b61b9f4430d5f420d56605a6e7993e0941470`
- Retrieved: 2026-11-01
- SHA-256: `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`
- Size: 352,240 bytes; full variable font, retaining its original glyph coverage.

The existing Inter family is loaded through `next/font/local` so builds do not depend on Google Fonts returning a URL with a file extension. GitHub CI exposed the existing loader's null-match failure, matching [Next.js issue #99114](https://github.com/vercel/next.js/issues/99114). The established Fraunces/Geist stylesheet remains unchanged. This does not add a new font family or upgrade Next.js.
