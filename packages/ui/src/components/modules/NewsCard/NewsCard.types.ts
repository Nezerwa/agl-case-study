import type { NavLinkComponent } from "../../../types/link.types";

export interface NewsCardImage {
  src: string;
  alt: string;
}

/**
 * The card sits under the page `h1`, so `h3` is the default. A caller that renders
 * the grid under its own section heading can drop it to `h2`.
 */
export type NewsCardHeadingLevel = "h2" | "h3";

export interface NewsCardProps {
  image: NewsCardImage;
  categoryLabel: string;
  date: string;
  title: string;
  description: string;
  href: string;
  readMoreLabel?: string;
  headingLevel?: NewsCardHeadingLevel;
  linkComponent?: NavLinkComponent;
  className?: string;
}
