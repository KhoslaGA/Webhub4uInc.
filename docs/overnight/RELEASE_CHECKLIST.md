# Review and release checklist

Prepared 2026-11-01. This task prepares a branch and draft PR; only the owner merges or releases production.

## Review gates

1. Review the final diff and this handoff. CI workflow `CI`, job/status **`build`**, now uses Node 22 (matching the existing host), installs the lockfile, runs delivery regression tests, builds, runs mocked browser journeys, verifies the SEO audit and audits all rendered sitemap pages. There are no production deployment or live-delivery steps in this workflow.
2. Require `build` on `main` and PR review through the owner's GitHub rules settings. A workflow alone does not enforce branch protection. Account-specific observations are in the local private handoff. Do not weaken existing rules if they change after this review.
3. Review the existing Claude workflow and pinned action. The owner may install the [official Claude setup instructions](https://code.claude.com/docs/en/github-actions) for **this repository only**, review requested permissions, and enter `ANTHROPIC_API_KEY` through GitHub Actions secrets. The workflow already has bounded turns/time and no deployment secret. It must never auto-approve/merge. Its comment about branch protection is aspirational until the owner configures the gate. Missing Claude setup does not block this branch.
4. Confirm `RESEND_API_KEY`, verified `EMAIL_FROM` and owner-approved `EMAIL_TO` in production. Review any GHL workflow independently. See `EMAIL_SETUP.md`. Do not copy production keys into preview.
5. Review the preview UI. It intentionally returns 503 for enquiries, disables analytics forwarding and serves noindex. Mocked acceptance and failure behaviour is covered locally/CI; preview is not an inbox-delivery test.

## Owner release

- Verify the existing Vercel project is still associated with `KhoslaGA/Webhub4uInc.`, production branch `main`. The task verified this association; do not create a replacement project.
- Record the currently serving production deployment ID/URL and Git SHA immediately before release. Keep that deployment available as the rollback target.
- Merge only the reviewed PR after required gates pass. The existing Git integration deploys `main`; a merge is a production action.
- Check the apex redirect to `https://www.webhub4u.com`, homepage, three service pages, both case studies, contact preselection, robots and sitemap. Ensure **production** has no preview noindex header.
- Submit at most one labelled synthetic enquiry to the confirmed owner inbox only with approved provider configuration. Record provider acceptance, then receipt separately. No repeat on unknown outcome; reconcile first. Defer a live GHL demo test if sales side effects have not been ruled out.

## Rollback

If production smoke checks or delivery fail, use the existing project's Vercel deployment history to roll back to the recorded known-good production deployment. Do not change DNS or promote an unreviewed preview. Recheck the public routes and configuration. Revert the merge through a reviewed PR before resuming production changes, and note that a rollback can alter automatic domain assignment; the owner should review that setting before the next release.

## Local reproduction

```sh
npm ci --no-audit --no-fund
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:browser
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/seo_audit.py --build-dir .next/server/app
```

No production keys are needed. Two pre-existing lint warnings remain: external font loading in the App Router layout and the analytics fallback pixel `<img>`. Browser QA uses synthetic data and mocked provider calls. No TypeScript check is separately configured in this JavaScript application.
