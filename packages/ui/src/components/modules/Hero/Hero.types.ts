import type { ReactNode } from "react";

/**
 * `brand` sits on the pink brand gradient with white text.
 * `surface` has no background of its own and uses dark text, for a Hero placed
 * mid-page on the ordinary white surface.
 */
export type HeroVariant = "brand" | "surface";

export type HeroAlign = "left" | "center";

/**
 * Drives both semantics and type scale, exactly as the design does:
 * `h1` renders 48/72 with a 24px gap above the description, `h2` renders 32/48
 * with a 16px gap.
 */
export type HeroHeadingLevel = "h1" | "h2";

/**
 * Vertical rhythm only — the type scale rides on `headingLevel`, not on this.
 * `large` is for a Hero used as a standalone band between page sections, which the
 * design gives noticeably more breathing room than a page header.
 */
export type HeroSize = "default" | "large";

export interface HeroBadge {
  label: string;
  icon?: ReactNode;
}

export interface HeroProps {
  title: string;
  description?: string;
  badge?: HeroBadge;
  variant?: HeroVariant;
  align?: HeroAlign;
  headingLevel?: HeroHeadingLevel;
  size?: HeroSize;
  className?: string;
}
