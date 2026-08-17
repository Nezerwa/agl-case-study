import { describe, expect, it } from "vitest";
import type { FormFieldConfig } from "@agl/ui";
import { CONTACT_TYPE_RULES, buildContactSchema } from "./contact.schema";

function field(overrides: Partial<FormFieldConfig> = {}): FormFieldConfig {
  return {
    id: "fullName",
    name: "fullName",
    label: "Nom / Prénom (s)",
    type: "text",
    ...overrides,
  };
}

/** The Contact configuration as the mock now authors it. */
const contactFields: FormFieldConfig[] = [
  field({ required: true }),
  field({ id: "phone", name: "phone", label: "N° Tél", type: "tel", required: true }),
  field({ id: "email", name: "email", label: "E-mail", type: "email", required: true }),
  field({ id: "company", name: "company", label: "Société", required: true }),
  field({ id: "subject", name: "subject", label: "Objet" }),
  field({
    id: "message",
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
  }),
];

const validSubmission = {
  fullName: "Aïcha O'Connor-Diallo",
  phone: "+222 45 67 89 01",
  email: "aicha@example.com",
  company: "SOGECO",
  subject: "Demande de devis",
  message: "Bonjour, je souhaite un devis pour du transport multimodal.",
};

function parseContact(overrides: Record<string, unknown> = {}) {
  return buildContactSchema(contactFields).safeParse({
    ...validSubmission,
    ...overrides,
  });
}

describe("buildContactSchema — requiredness comes from configuration", () => {
  it("rejects an empty value for every field the CMS marks required", () => {
    for (const name of ["fullName", "phone", "email", "company", "message"]) {
      expect(parseContact({ [name]: "" }).success).toBe(false);
    }
  });

  it("accepts an empty value for a field the CMS leaves optional", () => {
    const result = parseContact({ subject: "" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.subject).toBeUndefined();
    }
  });

  it("accepts a submission that omits the optional field entirely", () => {
    const { subject, ...withoutSubject } = validSubmission;

    expect(subject).toBeDefined();
    expect(buildContactSchema(contactFields).safeParse(withoutSubject).success).toBe(
      true,
    );
  });

  /**
   * The point of the whole exercise: the same field flipped in configuration changes
   * validation, with no code touched on either side.
   */
  it("flips validation when a field's required flag flips", () => {
    const optional = [field({ name: "note", label: "Note" })];
    const required = [field({ name: "note", label: "Note", required: true })];

    expect(buildContactSchema(optional).safeParse({ note: "" }).success).toBe(true);
    expect(buildContactSchema(required).safeParse({ note: "" }).success).toBe(false);
  });

  it("hardcodes no field names — an entirely different form validates too", () => {
    const schema = buildContactSchema([
      field({ name: "reference", label: "Référence", required: true }),
      field({ name: "comment", label: "Commentaire", type: "textarea" }),
    ]);

    expect(schema.safeParse({ reference: "AGL-1", comment: "" }).success).toBe(true);
    expect(schema.safeParse({ reference: "", comment: "" }).success).toBe(false);
  });

  it("builds an empty schema from an empty configuration", () => {
    expect(buildContactSchema([]).safeParse({}).success).toBe(true);
  });
});

describe("buildContactSchema — type rules survive requiredness", () => {
  it("still rejects a malformed e-mail when the field is required", () => {
    for (const email of ["nope", "a@", "@b.com", "a b@c.com"]) {
      expect(parseContact({ email }).success).toBe(false);
    }
  });

  it("still rejects a malformed e-mail when the field is optional", () => {
    const schema = buildContactSchema([
      field({ name: "email", label: "E-mail", type: "email" }),
    ]);

    expect(schema.safeParse({ email: "" }).success).toBe(true);
    expect(schema.safeParse({ email: "nope" }).success).toBe(false);
  });

  it("rejects a phone number containing letters", () => {
    expect(parseContact({ phone: "appelez-moi" }).success).toBe(false);
  });

  it("keeps the textarea minimum, so a required message cannot be one character", () => {
    expect(parseContact({ message: "court" }).success).toBe(false);
    expect(parseContact({ message: "Un message assez long." }).success).toBe(true);
  });

  it("applies the textarea minimum to an optional textarea only once filled", () => {
    const schema = buildContactSchema([
      field({ name: "notes", label: "Notes", type: "textarea" }),
    ]);

    expect(schema.safeParse({ notes: "" }).success).toBe(true);
    expect(schema.safeParse({ notes: "court" }).success).toBe(false);
  });
});

describe("buildContactSchema — bounds", () => {
  it("caps every field by its type", () => {
    expect(parseContact({ fullName: "x".repeat(CONTACT_TYPE_RULES.text.max + 1) }).success).toBe(false);
    expect(parseContact({ message: "x".repeat(CONTACT_TYPE_RULES.textarea.max + 1) }).success).toBe(false);
    expect(parseContact({ phone: "1".repeat(CONTACT_TYPE_RULES.tel.max + 1) }).success).toBe(false);
  });

  it("caps an optional field too, so absence is the only way to skip it", () => {
    expect(parseContact({ subject: "x".repeat(CONTACT_TYPE_RULES.text.max + 1) }).success).toBe(false);
  });

  it("accepts a value exactly at the limit", () => {
    expect(parseContact({ subject: "x".repeat(CONTACT_TYPE_RULES.text.max) }).success).toBe(true);
  });
});

describe("buildContactSchema — normalisation", () => {
  it("accepts a complete submission", () => {
    expect(parseContact().success).toBe(true);
  });

  it("accepts names with apostrophes, hyphens and accents", () => {
    for (const fullName of ["O'Connor", "Jean-Pierre", "Aïcha Ndiaye", "Éloïse"]) {
      expect(parseContact({ fullName }).success).toBe(true);
    }
  });

  it("trims every field", () => {
    const result = parseContact({ fullName: "  Aïcha  ", subject: "  Devis  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Aïcha");
      expect(result.data.subject).toBe("Devis");
    }
  });

  it("lowercases the e-mail so duplicates collapse", () => {
    const result = parseContact({ email: "  Aicha@Example.COM " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("aicha@example.com");
    }
  });

  it("counts length after trimming, so whitespace cannot satisfy a required field", () => {
    expect(parseContact({ fullName: "     " }).success).toBe(false);
  });
});
