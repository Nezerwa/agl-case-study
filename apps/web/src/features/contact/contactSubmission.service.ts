import { randomUUID } from "node:crypto";
import type { ContactSubmission } from "./contact.schema";

export interface ContactSubmissionResult {
  referenceId: string;
}

/**
 * The one deliberately mocked step. Everything upstream — validation, origin, rate
 * limiting, honeypot, normalisation — is real; this stands in for the CRM, ticketing or
 * transactional-email provider that would receive the message in production.
 *
 * Swapping in a real provider is a change to this file alone: the API route only awaits
 * a reference id and treats a throw as a failure.
 *
 * Nothing here logs the submission body. Names, addresses and message contents are
 * personal data, and a console line is the easiest way for it to end up somewhere it was
 * never meant to be.
 */
export async function submitContactForm(
  submission: ContactSubmission,
): Promise<ContactSubmissionResult> {
  if (process.env.NODE_ENV !== "test") {
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  const referenceId = `AGL-${randomUUID().slice(0, 8).toUpperCase()}`;

  if (process.env.NODE_ENV === "development") {
    const supplied = Object.entries(submission).filter(
      ([, value]) => value !== undefined,
    );

    console.info("[contact] accepted", {
      referenceId,
      fieldsSupplied: supplied.length,
      totalLength: supplied.reduce((sum, [, value]) => sum + (value?.length ?? 0), 0),
    });
  }

  return { referenceId };
}
