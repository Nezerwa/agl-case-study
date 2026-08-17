import type { CategoryOption, NewsGridItem } from "@agl/ui";

export const ALL_CATEGORIES = "all";

/**
 * `category` is the stable machine value the filter compares on. It never reaches
 * `@agl/ui` — NewsCard displays `categoryLabel` and knows nothing about filtering.
 */
export interface NewsArticle extends NewsGridItem {
  category: string;
}

export interface NewsListingProps {
  categories: CategoryOption[];
  articles: NewsArticle[];
  initialCategory?: string;
  filterAriaLabel?: string;
  gridAriaLabel?: string;
  emptyMessage?: string;
}
