import { handleDemoRequest } from "../../../lib/demoRequest.mjs";
import { enquiryProviders } from "../../../lib/enquiryProviders.mjs";

export const maxDuration = 30;

export async function POST(req) {
  return handleDemoRequest(req, enquiryProviders());
}
