import type { NextApiRequest, NextApiResponse } from "next";
import {
  HONEYPOT_FIELD,
  buildContactSchema,
} from "@/features/contact/contact.schema";
import { getContactFormFields } from "@/features/contact/contactFormFields";
import { submitContactForm } from "@/features/contact/contactSubmission.service";
import { createInMemoryRateLimiter } from "@/server/rateLimit";
import { getClientIdentifier, isAllowedOrigin } from "@/server/requestGuards";

export type ContactApiResponse =
  | { success: true; referenceId: string }
  | { success: false; error: ContactApiError; fieldErrors?: Record<string, string> };

export type ContactApiError =
  | "METHOD_NOT_ALLOWED"
  | "INVALID_REQUEST"
  | "FORBIDDEN_ORIGIN"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SUBMISSION_FAILED";

/**
 * The longest legitimate submission is roughly 6 KB of text. Rejecting oversized bodies
 * here means a multi-megabyte POST never reaches Zod, so `.max()` on each string is the
 * second line of defence rather than the only one.
 */
export const config = {
  api: { bodyParser: { sizeLimit: "16kb" } },
};

const rateLimiter = createInMemoryRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});

/** Exposed for tests only; the limiter is module state that would leak between cases. */
export const __rateLimiter = rateLimiter;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactApiResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "METHOD_NOT_ALLOWED" });
  }

  const body: unknown = req.body;
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({ success: false, error: "INVALID_REQUEST" });
  }

  const origin = firstHeader(req.headers.origin);
  if (!isAllowedOrigin(origin, firstHeader(req.headers.host))) {
    return res.status(403).json({ success: false, error: "FORBIDDEN_ORIGIN" });
  }

  const decision = rateLimiter.check(
    getClientIdentifier({
      forwardedFor: req.headers["x-forwarded-for"],
      realIp: req.headers["x-real-ip"],
      remoteAddress: req.socket?.remoteAddress,
    }),
  );

  if (!decision.allowed) {
    res.setHeader("Retry-After", String(decision.retryAfterSeconds));
    return res.status(429).json({ success: false, error: "RATE_LIMITED" });
  }

  // A person never sees this field, so anything in it came from something automated.
  // The response is deliberately shaped like every other rejection so a bot learns
  // nothing about why it failed.
  const record = body as Record<string, unknown>;
  if (Object.hasOwn(record, HONEYPOT_FIELD) && record[HONEYPOT_FIELD] !== "") {
    return res.status(400).json({ success: false, error: "INVALID_REQUEST" });
  }

  // Built from the server's own copy of the CMS configuration. Nothing in the request
  // influences which fields are required.
  const schema = buildContactSchema(await getContactFormFields());
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      fieldErrors: toFieldErrors(parsed.error.issues),
    });
  }

  try {
    const { referenceId } = await submitContactForm(parsed.data);
    return res.status(200).json({ success: true, referenceId });
  } catch {
    // The thrown value may carry provider hostnames, credentials or stack frames.
    // The client is told only that it failed.
    return res.status(500).json({ success: false, error: "SUBMISSION_FAILED" });
  }
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * One message per field, nothing else. The raw Zod tree carries the schema's internal
 * shape, which is more than a caller needs and more than we want to publish.
 */
function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !Object.hasOwn(fieldErrors, field)) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
