import type { CmsFields, CmsImageValue, CmsLinkValue } from "@agl/cms-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readText(fields: CmsFields, key: string): string | undefined {
  const field = fields[key];
  if (!isRecord(field)) return undefined;
  return typeof field.value === "string" ? field.value : undefined;
}

export function requireText(
  fields: CmsFields,
  key: string,
  fallback: string,
): string {
  return readText(fields, key) ?? fallback;
}

export function readNumber(fields: CmsFields, key: string): number | undefined {
  const field = fields[key];
  if (!isRecord(field)) return undefined;
  return typeof field.value === "number" ? field.value : undefined;
}

/**
 * Reads a string off one entry of a repeating field. Entries arrive as plain objects
 * rather than `{ value }` wrappers, and `Object.hasOwn` keeps a polluted prototype
 * from supplying content the CMS never authored.
 */
export function readEntryText(item: unknown, key: string): string | undefined {
  if (!isRecord(item) || !Object.hasOwn(item, key)) return undefined;

  const value = item[key];
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Returns the raw items untouched. A repeating field can hold anything, so narrowing
 * each item is the calling adapter's job — this only guarantees you get an array.
 */
export function readList(
  fields: CmsFields,
  key: string,
): unknown[] | undefined {
  const field = fields[key];
  if (!isRecord(field)) return undefined;
  return Array.isArray(field.value) ? field.value : undefined;
}

export function readImage(
  fields: CmsFields,
  key: string,
): CmsImageValue | undefined {
  const field = fields[key];
  if (!isRecord(field) || !isRecord(field.value)) return undefined;

  const { src, alt, width, height } = field.value;
  if (typeof src !== "string" || typeof alt !== "string") return undefined;

  return {
    src,
    alt,
    width: typeof width === "number" ? width : undefined,
    height: typeof height === "number" ? height : undefined,
  };
}

export function readLink(
  fields: CmsFields,
  key: string,
): CmsLinkValue | undefined {
  const field = fields[key];
  if (!isRecord(field) || !isRecord(field.value)) return undefined;

  const { href, text, title, target } = field.value;
  if (typeof href !== "string") return undefined;

  return {
    href,
    text: typeof text === "string" ? text : undefined,
    title: typeof title === "string" ? title : undefined,
    target: target === "_blank" || target === "_self" ? target : undefined,
  };
}
