import { useState } from "react";
import Link from "next/link";
import { CategoryFilter, NewsGrid } from "@agl/ui";
import type { NavLinkProps } from "@agl/ui";
import { ALL_CATEGORIES } from "./NewsListing.types";
import type { NewsListingProps } from "./NewsListing.types";
import { filterNewsByCategory } from "./NewsListing.utils";

export type { NewsArticle, NewsListingProps } from "./NewsListing.types";

function NextLink({ href, children, ...rest }: NavLinkProps) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/**
 * The Actualités feature layer. It owns the selected category because two independent
 * `@agl/ui` components need to agree on it: CategoryFilter reports the change and
 * NewsGrid receives the result. Neither knows the other exists.
 *
 * Card titles are `h2` here rather than NewsCard's default `h3`: on this page they sit
 * directly beneath the `h1` with no section heading between, so `h3` would skip a
 * level. That is a fact about this composition, not about the card, which is why it is
 * set here and NewsCard's default is left alone.
 */
export function NewsListing({
  categories,
  articles,
  initialCategory,
  filterAriaLabel,
  gridAriaLabel,
  emptyMessage,
}: NewsListingProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ?? categories[0]?.value ?? ALL_CATEGORIES,
  );

  const filteredArticles = filterNewsByCategory(articles, selectedCategory);

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedValue={selectedCategory}
        onChange={setSelectedCategory}
        ariaLabel={filterAriaLabel}
      />
      <NewsGrid
        items={filteredArticles}
        ariaLabel={gridAriaLabel}
        emptyMessage={emptyMessage}
        headingLevel="h2"
        linkComponent={NextLink}
      />
    </>
  );
}
