import { describe, expect, it } from "vitest";
import type { CmsComponent } from "@agl/cms-types";
import { mapCategoryOptions } from "./categoryFilter.adapter";

function filterComponent(fields: CmsComponent["fields"]): CmsComponent {
  return { uid: "u1", componentName: "CategoryFilter", fields };
}

function withCategories(value: unknown): CmsComponent {
  return filterComponent({ categories: { value } });
}

describe("mapCategoryOptions", () => {
  it("maps CMS categories into CategoryOption[]", () => {
    const options = mapCategoryOptions(
      withCategories([
        { id: "all", label: "Tous", value: "all" },
        { id: "events", label: "Événements", value: "events" },
        { id: "press", label: "Presse", value: "press" },
      ]),
    );

    expect(options).toEqual([
      { id: "all", label: "Tous", value: "all" },
      { id: "events", label: "Événements", value: "events" },
      { id: "press", label: "Presse", value: "press" },
    ]);
  });

  it("preserves the content id even when it differs from the filter value", () => {
    const options = mapCategoryOptions(
      withCategories([
        { id: "3f9a-c001-uid", label: "Événements", value: "events" },
      ]),
    );

    expect(options[0]).toMatchObject({ id: "3f9a-c001-uid", value: "events" });
  });

  it("keeps the order the CMS authored", () => {
    const options = mapCategoryOptions(
      withCategories([
        { id: "press", label: "Presse", value: "press" },
        { id: "all", label: "Tous", value: "all" },
      ]),
    );

    expect(options.map((option) => option.value)).toEqual(["press", "all"]);
  });

  it("falls back to the id when no separate filter value is authored", () => {
    const options = mapCategoryOptions(
      withCategories([{ id: "events", label: "Événements" }]),
    );

    expect(options[0]).toEqual({
      id: "events",
      label: "Événements",
      value: "events",
    });
  });

  it("trims surrounding whitespace", () => {
    const options = mapCategoryOptions(
      withCategories([{ id: " all ", label: "  Tous  ", value: " all " }]),
    );

    expect(options[0]).toEqual({ id: "all", label: "Tous", value: "all" });
  });
});

describe("mapCategoryOptions — malformed content", () => {
  it("returns an empty list when the field is absent", () => {
    expect(mapCategoryOptions(filterComponent({}))).toEqual([]);
  });

  it("returns an empty list when the field is not an array", () => {
    expect(mapCategoryOptions(withCategories("Tous, Presse"))).toEqual([]);
    expect(mapCategoryOptions(withCategories(42))).toEqual([]);
    expect(mapCategoryOptions(withCategories(null))).toEqual([]);
  });

  it("drops entries that are not objects", () => {
    const options = mapCategoryOptions(
      withCategories(["Tous", 7, null, undefined, { id: "all", label: "Tous" }]),
    );

    expect(options).toHaveLength(1);
    expect(options[0].value).toBe("all");
  });

  it("drops entries with no label, because a blank control is unusable", () => {
    const options = mapCategoryOptions(
      withCategories([
        { id: "all", value: "all" },
        { id: "events", label: "   ", value: "events" },
        { id: "press", label: "Presse", value: "press" },
      ]),
    );

    expect(options).toEqual([{ id: "press", label: "Presse", value: "press" }]);
  });

  it("drops entries with no id, because nothing stable identifies them", () => {
    const options = mapCategoryOptions(
      withCategories([{ label: "Tous", value: "all" }]),
    );

    expect(options).toEqual([]);
  });

  it("drops entries whose fields are the wrong type", () => {
    const options = mapCategoryOptions(
      withCategories([{ id: 1, label: 2, value: 3 }]),
    );

    expect(options).toEqual([]);
  });

  it("does not read inherited object properties", () => {
    const inherited = Object.create({ id: "all", label: "Tous", value: "all" });

    expect(mapCategoryOptions(withCategories([inherited]))).toEqual([]);
  });
});

describe("mapCategoryOptions — shape handed to the UI", () => {
  it("produces plain options, never a CMS field wrapper", () => {
    const options = mapCategoryOptions(
      withCategories([{ id: "all", label: "Tous", value: "all" }]),
    );

    expect(Object.keys(options[0]).sort()).toEqual(["id", "label", "value"]);
  });
});
