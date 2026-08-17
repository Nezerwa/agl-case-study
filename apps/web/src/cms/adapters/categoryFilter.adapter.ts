import type { CmsComponent } from "@agl/cms-types";
import type { CategoryOption } from "@agl/ui";
import { readEntryText, readList } from "../fields";

/**
 * A category is only usable if it can be both shown and filtered on, so an entry
 * missing an id or a label is dropped rather than rendered as a blank control.
 * `value` falls back to the id, which is the common case where content authors
 * maintain one key rather than two.
 */
function toCategoryOption(item: unknown): CategoryOption | undefined {
  const id = readEntryText(item, "id");
  const label = readEntryText(item, "label");

  if (!id || !label) return undefined;

  return { id, label, value: readEntryText(item, "value") ?? id };
}

export function mapCategoryOptions(component: CmsComponent): CategoryOption[] {
  const items = readList(component.fields, "categories") ?? [];

  return items
    .map(toCategoryOption)
    .filter((option): option is CategoryOption => option !== undefined);
}
