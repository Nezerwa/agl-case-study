import type { NavLinkComponent } from "../../../types/link.types";
import type { NewsCardHeadingLevel, NewsCardProps } from "../NewsCard/NewsCard.types";

/**
 * The id belongs to the collection, not to the card: NewsCard renders one article and
 * has no reason to know its CMS identity, but a list needs a stable key.
 */
export interface NewsGridItem extends NewsCardProps {
  id: string;
}

export interface NewsGridProps {
  items: NewsGridItem[];
  emptyMessage?: string;
  ariaLabel?: string;
  headingLevel?: NewsCardHeadingLevel;
  linkComponent?: NavLinkComponent;
  className?: string;
}
