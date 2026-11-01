const uncertain = "We couldn't confirm delivery. Your details are still here. Please contact us before retrying; another submission could create a duplicate.";

// Keep the same key for an unchanged manual retry. Resend deduplicates it for
// 24 hours. GHL has no verified retry contract: the UI warns on unknown outcomes.
export async function submitEnquiry(url, payload, attempt, fetcher = fetch) {
  const fingerprint = JSON.stringify(payload);
  if (attempt.fingerprint !== fingerprint) {
    attempt.fingerprint = fingerprint;
    attempt.id = crypto.randomUUID();
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetcher(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, submissionId: attempt.id }), signal: controller.signal });
    let result;
    try { result = await res.json(); } catch { throw new Error(uncertain); }
    if (!res.ok || result.ok !== true || result.outcome !== "accepted") {
      throw new Error(typeof result.error === "string" ? result.error : uncertain);
    }
    return result;
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError) throw new Error(uncertain);
    throw error;
  } finally { clearTimeout(timer); }
}
