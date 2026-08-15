import { describe, expect, it } from "vitest";
import type { CmsComponent } from "@agl/cms-types";
import { mapHero } from "./hero.adapter";

function heroComponent(fields: CmsComponent["fields"]): CmsComponent {
  return {
    uid: "test-uid",
    componentName: "Hero",
    fields,
  };
}

describe("mapHero", () => {
  it("maps a complete CMS component to Hero props", () => {
    const component = heroComponent({
      eyebrow: { value: "AGL Group" },
      title: { value: "Nos Actualités" },
      description: { value: "Les dernières nouvelles" },
    });

    expect(mapHero(component)).toEqual({
      eyebrow: "AGL Group",
      title: "Nos Actualités",
      description: "Les dernières nouvelles",
    });
  });

  it("leaves optional props undefined when the fields are absent", () => {
    const component = heroComponent({ title: { value: "Nos Actualités" } });

    expect(mapHero(component)).toEqual({
      eyebrow: undefined,
      title: "Nos Actualités",
      description: undefined,
    });
  });

  it("falls back to an empty title rather than throwing on malformed data", () => {
    expect(mapHero(heroComponent({})).title).toBe("");
  });

  it("ignores fields that do not match the CMS field shape", () => {
    const component = heroComponent({
      title: { value: "Titre" },
      eyebrow: "not-a-field",
    });

    expect(mapHero(component).eyebrow).toBeUndefined();
  });

  it("returns no CMS-shaped properties, only clean UI props", () => {
    const component = heroComponent({ title: { value: "Titre" } });

    expect(Object.keys(mapHero(component)).sort()).toEqual([
      "description",
      "eyebrow",
      "title",
    ]);
  });
});
