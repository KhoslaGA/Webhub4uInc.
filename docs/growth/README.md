# Webhub4U growth foundation

Reviewed 20 October 2026. Work branch changes require a reviewed merge; main deploys through the existing hosting setup.

## What this change does

- Uses `BUSINESS.url = https://www.webhub4u.com` for the metadata base, sitemap, robots and existing schema/RSS consumers.
- Adds self-referencing canonicals to seven previously missing static pages.
- Stops announcing today's date as the modification date of every static page on every build.
- Adds existing business schema to the homepage, without inventing a street address or reviews.
- Features RateFamily and Insurimple in the portfolio. Distinguishes the public RateFamily sites from mock-data V2 and describes Insurimple as an ongoing engineering project.
- Adds a bounded, dependency-free Python SEO audit and runs it against the built site in CI.
- Adds a weekly production audit. The schedule activates only when the workflow reaches the default branch. It stores a report; it does not edit the site or publish content.
- Updates Next.js and eslint-config-next from 14.2.5 to 14.2.35, the 14.x patch listed in the December 2025 security advisory. This is not a complete security assessment or a major-version migration.

## Run

```bash
npm ci --no-audit --no-fund
npm run build
python -m unittest discover -s scripts -p 'test_*.py'
python scripts/seo_audit.py --build-dir .next/server/app
# Optional local HTTP audit, after starting Next in another terminal:
# npm run start -- --hostname 127.0.0.1 --port 3000
# python scripts/seo_audit.py --base http://127.0.0.1:3000
# Public production audit:
python scripts/seo_audit.py
```

The audit reads robots.txt, same-domain sitemaps and up to 100 initial HTML pages. Errors: failed requests, wrong/missing/duplicate canonicals, noindex on sitemap pages, missing or duplicate titles, missing descriptions, non-HTML responses and sitemap origin conflicts. H1 and missing image-alt attributes are warnings. Exit 1 means errors or incomplete discovery; an empty/unreachable site never passes. Build mode reads prerendered Next.js artifacts and does not verify HTTP behavior. CI uses build mode; the weekly production job uses HTTP mode. Neither mode measures rankings, indexing, Core Web Vitals, full accessibility, all internal links or conversions.

## Evidence and release review

The public site crawl on 2026-10-20 contained 28 sitemap URLs. Seven pages lacked canonicals and 21 used the non-www host. Every sitemap entry used that host as well. The resulting 57 audit errors count repeated signals, not 57 independent business problems.

The existing RateFamily case study contained dated CMS/agent and structural-count claims. The update uses the four publicly available brand sites and the Rate-Family-V2 README's distinction between public education sites and mock development data. It does not claim measured SEO gains. The Insurimple copy summarises current internal platform/BMS documentation at a high level. It does not publish source code, credentials, customer records, internal infrastructure details or an enterprise production/certification claim.

Before publishing the portfolio, review the product descriptions and add approved screenshots using fixture data. Keep project pages under `/projects/`; do not introduce a competing `/work/` or `/portfolio/` collection. Industry demonstrations should be labelled separately from owned products and client work.

## Next implementation order

1. Confirm the current business phone, GBP business details and offer prices in `src/lib/business.js`, then reconcile visible copy. Existing phone/prices are preserved in this patch because the supplied briefs disagree.
2. Add substantial web-development, SEO and custom-software service pages. Link each to the relevant project and contact flow. Map search intent before deciding slugs; generic `/services/[id]` currently redirects.
3. Connect first-party analytics. Record organic qualified enquiries, non-brand search clicks, page/query trends and conversion rates. Validate `lead_form_submit` against server-confirmed success and deduplicate events. Do not place personal information in analytics.
4. Improve the 12 existing local pages using original local work and service evidence. Avoid thin city × service duplication and guaranteed ranking dates.
5. Capture authentic product screenshots and short demos. Add real outcome tables only when a dated baseline and comparison exist.
6. Validate the current supported Next.js release path and remaining dependency advisories as a separate upgrade scope.

## References

- Next metadata: https://nextjs.org/docs/14/app/api-reference/functions/generate-metadata
- Canonicals: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- GitHub scheduled workflows: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
- Security patch: https://nextjs.org/blog/security-update-2025-12-11
- RateFamily V2 scope: https://github.com/KhoslaGA/Rate-Family-V2/blob/main/README.md
