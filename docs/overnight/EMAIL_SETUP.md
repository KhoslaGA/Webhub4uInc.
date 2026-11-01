# Enquiry delivery setup

Reviewed 2026-11-01, America/Toronto. Code readiness is separate from provider configuration, acceptance and inbox receipt.

## Required server variables

| Name | Purpose | Scope |
| --- | --- | --- |
| `RESEND_API_KEY` | Restricted sending key for the approved Resend account | Production; optional isolated local development |
| `EMAIL_FROM` | Sender on an owner-controlled, verified domain, optionally `Webhub4U <sender@your-domain>` | Same environment as the key |
| `EMAIL_TO` | One owner-confirmed destination address | Same environment as the key |
| `GHL_WEBHOOK_URL` | Optional HTTPS inbound workflow webhook for demo requests only | Production after workflow review |

All three Resend variables are required. There is no default sender or recipient. The existing public contact email is not proof of the intended server delivery destination. Never use visitor input for `from` or `to`; visitor email is `replyTo`. The contact route uses email; the demo route uses GHL first when configured.

Set values securely in the existing Vercel project's environment settings. Never place credentials in a PR, issue, screenshot or chat. Verify the Resend sender domain with its prescribed DNS records through the owner's normal approval process. Confirm the destination with the owner. Setting production variables and redeploying are owner actions, not part of this branch.

## Response and retry contract

- JSON bodies are bounded at 16 KiB while streaming; fields, email and option values have server limits. Unsupported methods return 405; unsupported media types 415; malformed input 400; oversized input 413.
- Missing usable configuration returns 503. Nothing is treated as delivered because it was logged.
- Resend acceptance requires `error` to be absent and a non-empty `data.id`. A resolved error is handled, including rate limits. Transport/application errors and missing acknowledgement remain unknown.
- A GHL 2xx response must contain a non-empty top-level `id`, without an error or `success: false`. This validates inbound acknowledgement, not workflow completion, CRM persistence or sales follow-up.
- A definite GHL 4xx rejection (except 408) permits **one** configured email fallback. GHL 5xx, 408, malformed acknowledgements, transport errors and timeouts are **unknown**; they do not trigger fallback or a webhook retry.
- Each provider attempt is bounded to 8 seconds; the client waits up to 20 seconds; route maximum duration is 30 seconds. The Resend SDK request may continue after our response deadline. Its idempotency key protects unchanged manual email retries for the provider's 24-hour window; it does not cancel an accepted email.
- Client-generated submission IDs are reused for unchanged manual retries. Email keys include a normalized payload digest. There is no automatic retry. Refreshing the page, editing the request or retrying after 24 hours can create another email.
- No documented deduplication/reconciliation mechanism was verified for this GHL workflow. The submission ID is included for operator reconciliation, **not** claimed as server-enforced deduplication. On an unknown response, the UI asks the visitor to check before retrying and warns about duplicates. A manual GHL retry can create a duplicate workflow.
- `200 / {ok:true, outcome:"accepted"}` is the only client success condition. `502` means rejected, `504` unknown. Acceptance does not establish inbox receipt or a confirmed booking.

## Preview and automated verification

`VERCEL_ENV=preview` disables both enquiry providers, server conversion forwarding and the analytics component even if provider keys exist. Preview pages also receive noindex headers/metadata and disallow crawling. Do not set production delivery keys in preview. Automated tests mock provider calls and browser submissions; the actual unconfigured-route check uses only local synthetic data.

Before any live GHL test, inspect the full workflow for messages, sales sequences and other side effects. Do not assume a webhook is a passive inbox. Account-specific response-contract verification is still required because no configured webhook was available during this run.

After the owner configures and releases approved code, make at most one clearly labelled synthetic owner-inbox enquiry. Record provider acceptance and inbox receipt separately. Do not repeat an ambiguous send; check the provider record first. This run sent no live enquiries.

## Provider references

- [Resend send-email contract](https://resend.com/docs/api-reference/emails/send-email)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [HighLevel inbound webhook setup, including returned ID](https://help.gohighlevel.com/support/solutions/articles/48001237383)
- [HighLevel workflow trigger and mapping](https://help.gohighlevel.com/support/solutions/articles/155000003147/trigger-inbound-webhook)
