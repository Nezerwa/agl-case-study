import type { FormFieldConfig } from "@agl/ui";

export interface ContactFormProps {
  fields: FormFieldConfig[];
  submitLabel: string;
  title?: string;
  description?: string;
}

export type ContactFormStatus =
  | { state: "idle" }
  | { state: "success"; referenceId: string }
  | { state: "error"; message: string };
