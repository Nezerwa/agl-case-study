import type { CmsComponent } from "@agl/cms-types";
import type {
  HeroAlign,
  HeroHeadingLevel,
  HeroProps,
  HeroSize,
  HeroVariant,
} from "@agl/ui";
import { readText, requireText } from "../fields";

const HERO_VARIANTS: readonly HeroVariant[] = ["brand", "surface"];
const HERO_ALIGNS: readonly HeroAlign[] = ["left", "center"];
const HERO_HEADING_LEVELS: readonly HeroHeadingLevel[] = ["h1", "h2"];
const HERO_SIZES: readonly HeroSize[] = ["default", "large"];

export const DEFAULT_HERO_VARIANT: HeroVariant = "brand";
export const DEFAULT_HERO_ALIGN: HeroAlign = "left";
export const DEFAULT_HERO_HEADING_LEVEL: HeroHeadingLevel = "h1";
export const DEFAULT_HERO_SIZE: HeroSize = "default";

function normalize(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim().toLowerCase() : undefined;
}

/**
 * CMS values are authored outside the codebase, so an unrecognised string must
 * never reach the UI. Each of these falls back to the value the design uses most.
 */
export function mapHeroVariant(value: unknown): HeroVariant {
  const normalized = normalize(value);
  return (
    HERO_VARIANTS.find((variant) => variant === normalized) ??
    DEFAULT_HERO_VARIANT
  );
}

export function mapHeroAlign(value: unknown): HeroAlign {
  const normalized = normalize(value);
  return HERO_ALIGNS.find((align) => align === normalized) ?? DEFAULT_HERO_ALIGN;
}

export function mapHeroHeadingLevel(value: unknown): HeroHeadingLevel {
  const normalized = normalize(value);
  return (
    HERO_HEADING_LEVELS.find((level) => level === normalized) ??
    DEFAULT_HERO_HEADING_LEVEL
  );
}

export function mapHeroSize(value: unknown): HeroSize {
  const normalized = normalize(value);
  return HERO_SIZES.find((size) => size === normalized) ?? DEFAULT_HERO_SIZE;
}

const BADGE_ICON_SIZE = 20;

export function mapHero(component: CmsComponent): HeroProps {
  const { fields } = component;

  const badgeLabel = readText(fields, "badgeLabel");
  const badgeIconSrc = readText(fields, "badgeIconSrc");

  return {
    title: requireText(fields, "title", ""),
    description: readText(fields, "description"),
    variant: mapHeroVariant(readText(fields, "variant")),
    align: mapHeroAlign(readText(fields, "align")),
    headingLevel: mapHeroHeadingLevel(readText(fields, "headingLevel")),
    size: mapHeroSize(readText(fields, "size")),
    badge: badgeLabel
      ? {
          label: badgeLabel,
          // A plain <img>, not next/image. The icon is a 20px static SVG that was
          // already passed `unoptimized`, so the component contributed nothing but an
          // inline `style` attribute — the single reason the CSP would have needed
          // `style-src 'unsafe-inline'`.
          icon: badgeIconSrc ? (
            <img
              src={badgeIconSrc}
              alt=""
              width={BADGE_ICON_SIZE}
              height={BADGE_ICON_SIZE}
            />
          ) : undefined,
        }
      : undefined,
  };
}
