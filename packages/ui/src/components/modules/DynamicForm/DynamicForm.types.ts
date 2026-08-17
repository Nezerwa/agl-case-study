import type {
  ChangeEventHandler,
  FocusEventHandler,
  FormEvent,
  ReactNode,
} from "react";

export type FormFieldType = "text" | "email" | "tel" | "textarea";

export type FormFieldColSpan = 1 | 2;

export interface FormFieldConfig {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  colSpan?: FormFieldColSpan;
  hint?: string;
  rows?: number;
}

export type FormControlRef = (
  instance: HTMLInputElement | HTMLTextAreaElement | null,
) => void;

/**
 * Native control props only — no library types. React Hook Form's `register()` returns
 * `{ name, onChange, onBlur, ref }`, which is assignable to this as-is, so a form
 * library can drive the fields without this package ever importing one. A plain
 * controlled parent returns `{ value, onChange }` through the same seam.
 */
export interface FormControlProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  ref?: FormControlRef;
  disabled?: boolean;
}

export type DynamicFormHeadingLevel = "h2" | "h3";

export interface DynamicFormProps {
  fields: FormFieldConfig[];
  submitLabel: string;
  title?: string;
  description?: string;
  headingLevel?: DynamicFormHeadingLevel;
  errors?: Record<string, string | undefined>;
  isSubmitting?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  getFieldProps?: (field: FormFieldConfig) => FormControlProps;
  requiredLabel?: string;
  /**
   * Turns off the browser's own constraint validation. Set it once the application owns
   * validation, so native bubbles stop competing with the designed error messages.
   */
  noValidate?: boolean;
  /**
   * Extra content rendered inside the `<form>`, after the fields and before the submit
   * button. The application needs somewhere to place controls the CMS does not author —
   * a honeypot, a hidden token — that must still be part of the submitted form.
   */
  children?: ReactNode;
  className?: string;
}
