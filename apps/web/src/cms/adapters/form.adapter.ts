import type { CmsComponent } from "@agl/cms-types";
import type {
  DynamicFormProps,
  FormFieldColSpan,
  FormFieldConfig,
  FormFieldType,
} from "@agl/ui";
import { readEntryText, readList, readText } from "../fields";

const FORM_FIELD_TYPES: readonly FormFieldType[] = [
  "text",
  "email",
  "tel",
  "textarea",
];

export const DEFAULT_SUBMIT_LABEL = "Envoyer";
export const DEFAULT_COL_SPAN: FormFieldColSpan = 1;

/**
 * An allowlist, not a cast. CMS content is authored outside the codebase, so an
 * unrecognised type must not reach the renderer — a field it cannot draw is dropped
 * rather than guessed at, since a silently mistyped control invites the wrong input.
 */
export function mapFormFieldType(value: unknown): FormFieldType | undefined {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : undefined;
  return FORM_FIELD_TYPES.find((type) => type === normalized);
}

export function mapColSpan(value: unknown): FormFieldColSpan {
  if (value === 2 || value === "2") return 2;
  return DEFAULT_COL_SPAN;
}

function readEntryFlag(item: unknown, key: string): boolean {
  if (typeof item !== "object" || item === null) return false;
  if (!Object.hasOwn(item, key)) return false;
  return (item as Record<string, unknown>)[key] === true;
}

function readEntryValue(item: unknown, key: string): unknown {
  if (typeof item !== "object" || item === null) return undefined;
  if (!Object.hasOwn(item, key)) return undefined;
  return (item as Record<string, unknown>)[key];
}

function toFormField(item: unknown): FormFieldConfig | undefined {
  const name = readEntryText(item, "name");
  const label = readEntryText(item, "label");
  const type = mapFormFieldType(readEntryValue(item, "type"));

  if (!name || !label || !type) return undefined;

  return {
    id: readEntryText(item, "id") ?? name,
    name,
    label,
    type,
    placeholder: readEntryText(item, "placeholder"),
    hint: readEntryText(item, "hint"),
    required: readEntryFlag(item, "required"),
    colSpan: mapColSpan(readEntryValue(item, "colSpan")),
  };
}

export function mapFormFields(component: CmsComponent): FormFieldConfig[] {
  const items = readList(component.fields, "formFields") ?? [];

  return items
    .map(toFormField)
    .filter((field): field is FormFieldConfig => field !== undefined);
}

export function mapDynamicForm(component: CmsComponent): DynamicFormProps {
  const { fields } = component;

  return {
    title: readText(fields, "title"),
    description: readText(fields, "description"),
    submitLabel: readText(fields, "submitLabel") ?? DEFAULT_SUBMIT_LABEL,
    fields: mapFormFields(component),
  };
}
