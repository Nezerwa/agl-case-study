import { ALL_CATEGORIES } from "./NewsListing.types";
import type { NewsArticle } from "./NewsListing.types";

/**
 * Compares the stable machine value, never the French label, so renaming
 * "Événements" in the CMS cannot break filtering.
 *
 * A category nothing matches returns nothing rather than falling back to every
 * article — a filter that silently ignores itself is worse than an empty result.
 */
export function filterNewsByCategory(
  articles: NewsArticle[],
  selectedCategory: string,
): NewsArticle[] {
  if (selectedCategory === ALL_CATEGORIES) {
    return articles;
  }

  return articles.filter((article) => article.category === selectedCategory);
}
