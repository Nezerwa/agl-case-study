import type { CmsComponent } from "@agl/cms-types";
import type { NewsArticle, NewsListingProps } from "@/components/NewsListing/NewsListing";
import { ALL_CATEGORIES } from "@/components/NewsListing/NewsListing.types";
import { readEntryText, readList, readText } from "../fields";
import { mapCategoryOptions } from "./categoryFilter.adapter";

function readEntryImage(item: unknown): { src: string; alt: string } | undefined {
  if (typeof item !== "object" || item === null) return undefined;
  if (!Object.hasOwn(item, "image")) return undefined;

  const image = (item as Record<string, unknown>).image;
  const src = readEntryText(image, "src");
  if (!src) return undefined;

  return { src, alt: readEntryText(image, "alt") ?? "" };
}

/**
 * An article needs an id to key on, a title to read, a link to follow and an image
 * slot to fill; anything missing one of those is dropped rather than rendered as a
 * broken card. `category` falls back to `all`, so a miscategorised article still
 * appears under "Tous" instead of vanishing from every view.
 *
 * An empty `alt` is deliberate and valid: it marks the image decorative when the
 * headline beside it already carries the meaning.
 */
function toNewsArticle(item: unknown): NewsArticle | undefined {
  const id = readEntryText(item, "id");
  const title = readEntryText(item, "title");
  const href = readEntryText(item, "href");
  const image = readEntryImage(item);

  if (!id || !title || !href || !image) return undefined;

  return {
    id,
    image,
    category: readEntryText(item, "category") ?? ALL_CATEGORIES,
    categoryLabel: readEntryText(item, "categoryLabel") ?? "",
    date: readEntryText(item, "date") ?? "",
    title,
    description: readEntryText(item, "description") ?? "",
    href,
  };
}

export function mapNewsArticles(component: CmsComponent): NewsArticle[] {
  const items = readList(component.fields, "articles") ?? [];

  return items
    .map(toNewsArticle)
    .filter((article): article is NewsArticle => article !== undefined);
}

export function mapNewsListing(component: CmsComponent): NewsListingProps {
  const { fields } = component;

  return {
    categories: mapCategoryOptions(component),
    articles: mapNewsArticles(component),
    initialCategory: readText(fields, "defaultCategory"),
    filterAriaLabel: readText(fields, "filterAriaLabel"),
    gridAriaLabel: readText(fields, "gridAriaLabel"),
    emptyMessage: readText(fields, "emptyMessage"),
  };
}
