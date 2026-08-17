import type { ReactNode } from "react";

/**
 * `solid` fills with the brand indigo and works on any background.
 *
 * `translucent` is a 10% white wash with no colour of its own, so it only reads
 * on a dark, image, or gradient surface — on a light background it disappears.
 * The consuming layout is responsible for placing it on a suitable surface.
 */
export type BadgeVariant = "solid" | "translucent";

export type BadgeSize = "small" | "medium";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}
