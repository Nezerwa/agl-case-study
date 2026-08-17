import { z } from "zod";
import type { FormFieldConfig, FormFieldType } from "@agl/ui";

/**
 * The schema is **generated from the field configuration**, so whether a field is
 * required is decided by the CMS and nothing else. Flipping `required` in the mock
 * changes the marker, the native attribute, the browser validation and the API
 * validation together — there is no second list to keep in step.
 *
 * The browser copy exists for **UX**: it tells a person what is wrong before they wait
 * for a round trip. It is not a security control. The API rebuilds the same schema from
 * its own copy of the configuration, and that run is the trust boundary.
 *
 * The CMS chooses only *whether* a supported field is required. It cannot supply a
 * pattern, a length or any other rule — those come from the field's type, below — so
 * there is no path from content to executable validation logic.
 */

/** A bot filling a field a person cannot see. Never part of the submitted data. */
export const HONEYPOT_FIELD = "website";

interface TypeRule {
  /** Upper bound, so an oversized value is rejected whatever the field is called. */
  max: number;
  /** Shortest value worth accepting once the field has been filled in at all. */
  min: number;
}

const TYPE_RULES: Record<FormFieldType, TypeRule> = {
  text: { max: 150, min: 1 },
  email: { max: 254, min: 1 },
  tel: { max: 30, min: 1 },
  textarea: { max: 5000, min: 10 },
};

const EMAIL = z.email();
const TEL_PATTERN = /^[+()\d\s.-]+$/;

/**
 * Bounds and shape only. Names legitimately contain apostrophes, hyphens and accents —
 * O'Connor, Jean-Pierre, Aïcha — so nothing here restricts which characters a person may
 * type. Stripping "suspicious" characters would corrupt real names while stopping no
 * real attack; escaping belongs at the point of output, not input.
 */
function matchesFormat(value: string, type: FormFieldType): boolean {
  if (type === "email") return EMAIL.safeParse(value).success;
  if (type === "tel") return TEL_PATTERN.test(value);
  return true;
}

function formatMessage(type: FormFieldType): string {
  if (type === "email") return "Adresse e-mail invalide";
  if (type === "tel") return "Numéro de téléphone invalide";
  return "Valeur invalide";
}

function buildFieldSchema(field: FormFieldConfig): z.ZodType {
  const { max, min } = TYPE_RULES[field.type];
  const trimmed = field.type === "email" ? z.string().trim().toLowerCase() : z.string().trim();

  const bounded = trimmed.max(
    max,
    `${field.label} ne peut pas dépasser ${max} caractères`,
  );

  const tooShort = `${field.label} doit contenir au moins ${min} caractères`;
  const badFormat = formatMessage(field.type);

  if (field.required) {
    return bounded
      .min(1, `${field.label} est obligatoire`)
      .refine((value) => value.length >= min, tooShort)
      .refine((value) => matchesFormat(value, field.type), badFormat);
  }

  // Absent and empty are both acceptable, but a value that *is* supplied still has to
  // hold up — an optional e-mail may be blank, never malformed.
  return bounded
    .refine((value) => value === "" || value.length >= min, tooShort)
    .refine((value) => value === "" || matchesFormat(value, field.type), badFormat)
    .transform((value) => (value === "" ? undefined : value))
    .optional();
}

export function buildContactSchema(
  fields: FormFieldConfig[],
): z.ZodType<ContactSubmission, ContactSubmission> {
  const shape: Record<string, z.ZodType> = {};

  for (const field of fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  // The shape is assembled at runtime, so Zod can only infer `Record<string, unknown>`.
  // Every branch of buildFieldSchema resolves to `string | undefined`, which is what the
  // declared return type states — the assertion narrows what inference cannot see.
  return z.object(shape) as unknown as z.ZodType<
    ContactSubmission,
    ContactSubmission
  >;
}

export type ContactSubmission = Record<string, string | undefined>;

export const CONTACT_TYPE_RULES = TYPE_RULES;
