import type { ReactNode } from "react";

/**
 * What FormField computes and the control must apply. Handing these back rather than
 * documenting them means the `id`, the error association and the invalid flag cannot
 * drift apart from the label and message that produced them.
 */
export interface FormFieldControl {
  id: string;
  required?: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  requiredLabel?: string;
  className?: string;
  children: (control: FormFieldControl) => ReactNode;
}
