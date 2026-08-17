import { describe, expect, it } from "vitest";
import type { CmsComponent } from "@agl/cms-types";
import {
  DEFAULT_HERO_ALIGN,
  DEFAULT_HERO_HEADING_LEVEL,
  DEFAULT_HERO_SIZE,
  DEFAULT_HERO_VARIANT,
  mapHero,
  mapHeroAlign,
  mapHeroHeadingLevel,
  mapHeroSize,
  mapHeroVariant,
} from "./hero.adapter";

function heroComponent(fields: CmsComponent["fields"]): CmsComponent {
  return { uid: "u1", componentName: "Hero", fields };
}

describe("mapHeroAlign", () => {
  it("maps supported values", () => {
    expect(mapHeroAlign("left")).toBe("left");
    expect(mapHeroAlign("center")).toBe("center");
  });

  it("normalises casing and whitespace", () => {
    expect(mapHeroAlign(" CENTER ")).toBe("center");
  });

  it("falls back for unsupported values", () => {
    expect(mapHeroAlign("justified")).toBe(DEFAULT_HERO_ALIGN);
    expect(mapHeroAlign(undefined)).toBe(DEFAULT_HERO_ALIGN);
    expect(mapHeroAlign(42)).toBe(DEFAULT_HERO_ALIGN);
    expect(mapHeroAlign("toString")).toBe(DEFAULT_HERO_ALIGN);
  });
});

describe("mapHeroVariant", () => {
  it("maps supported values", () => {
    expect(mapHeroVariant("brand")).toBe("brand");
    expect(mapHeroVariant("surface")).toBe("surface");
  });

  it("falls back for unsupported values", () => {
    expect(mapHeroVariant("neon")).toBe(DEFAULT_HERO_VARIANT);
    expect(mapHeroVariant(null)).toBe(DEFAULT_HERO_VARIANT);
  });
});

describe("mapHeroHeadingLevel", () => {
  it("maps supported values", () => {
    expect(mapHeroHeadingLevel("h1")).toBe("h1");
    expect(mapHeroHeadingLevel("h2")).toBe("h2");
  });

  it("falls back for unsupported values", () => {
    expect(mapHeroHeadingLevel("h3")).toBe(DEFAULT_HERO_HEADING_LEVEL);
    expect(mapHeroHeadingLevel({})).toBe(DEFAULT_HERO_HEADING_LEVEL);
  });
});

describe("mapHeroSize", () => {
  it("maps supported values", () => {
    expect(mapHeroSize("default")).toBe("default");
    expect(mapHeroSize("large")).toBe("large");
  });

  it("falls back for unsupported values", () => {
    expect(mapHeroSize("newsletter")).toBe(DEFAULT_HERO_SIZE);
    expect(mapHeroSize(undefined)).toBe(DEFAULT_HERO_SIZE);
  });
});

describe("mapHero", () => {
  it("maps a complete CMS component to Hero props", () => {
    const props = mapHero(
      heroComponent({
        title: { value: "Nos Actualités" },
        description: { value: "Découvrez les dernières nouvelles" },
        badgeLabel: { value: "Actualités" },
        variant: { value: "brand" },
        align: { value: "left" },
        headingLevel: { value: "h1" },
      }),
    );

    expect(props).toMatchObject({
      title: "Nos Actualités",
      description: "Découvrez les dernières nouvelles",
      badge: { label: "Actualités" },
      variant: "brand",
      align: "left",
      headingLevel: "h1",
    });
  });

  it("omits the badge when no label is supplied", () => {
    const props = mapHero(heroComponent({ title: { value: "Contactez-nous" } }));

    expect(props.badge).toBeUndefined();
  });

  it("builds a badge icon node when an icon source is supplied", () => {
    const props = mapHero(
      heroComponent({
        title: { value: "T" },
        badgeLabel: { value: "Actualités" },
        badgeIconSrc: { value: "/icons/badge-tag.svg" },
      }),
    );

    expect(props.badge?.icon).toBeDefined();
  });

  it("leaves the badge icon undefined when no source is supplied", () => {
    const props = mapHero(
      heroComponent({
        title: { value: "T" },
        badgeLabel: { value: "Actualités" },
      }),
    );

    expect(props.badge?.label).toBe("Actualités");
    expect(props.badge?.icon).toBeUndefined();
  });

  it("ignores a malformed badge icon source", () => {
    const props = mapHero(
      heroComponent({
        title: { value: "T" },
        badgeLabel: { value: "Actualités" },
        badgeIconSrc: { value: 42 },
      }),
    );

    expect(props.badge?.icon).toBeUndefined();
  });

  it("ignores fields the Hero contract does not declare", () => {
    const props = mapHero(
      heroComponent({
        title: { value: "T" },
        cta: { value: { href: "/contact", text: "Nous contacter" } },
      }),
    );

    expect(props).not.toHaveProperty("cta");
    expect(Object.keys(props).sort()).toEqual([
      "align",
      "badge",
      "description",
      "headingLevel",
      "size",
      "title",
      "variant",
    ]);
  });

  it("falls back safely on malformed presentation values", () => {
    const props = mapHero(
      heroComponent({
        title: { value: "T" },
        variant: { value: "neon" },
        align: { value: 123 },
        headingLevel: { value: "h7" },
      }),
    );

    expect(props.variant).toBe(DEFAULT_HERO_VARIANT);
    expect(props.align).toBe(DEFAULT_HERO_ALIGN);
    expect(props.headingLevel).toBe(DEFAULT_HERO_HEADING_LEVEL);
  });

  it("falls back to an empty title rather than throwing", () => {
    expect(mapHero(heroComponent({})).title).toBe("");
  });
});
