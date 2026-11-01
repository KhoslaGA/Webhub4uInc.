import { handleContactRequest } from "../../../lib/contactRequest.mjs";
import { enquiryProviders } from "../../../lib/enquiryProviders.mjs";

export const maxDuration = 30;

export async function POST(req) {
  return handleContactRequest(req, enquiryProviders());
}
