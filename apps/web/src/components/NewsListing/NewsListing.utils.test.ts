import { describe, expect, it } from "vitest";
import type { NewsArticle } from "./NewsListing.types";
import { filterNewsByCategory } from "./NewsListing.utils";

function article(id: string, category: string, categoryLabel: string): NewsArticle {
  return {
    id,
    category,
    categoryLabel,
    image: { src: `/images/news/${id}.svg`, alt: "" },
    date: "12 mars 2026",
    title: `Article ${id}`,
    description: "Description.",
    href: `/actualites/${id}`,
  };
}

const articles: NewsArticle[] = [
  article("salon", "events", "Événements"),
  article("gta", "press", "Presse"),
  article("installations", "events", "Événements"),
  article("partenariat", "press", "Presse"),
];

describe("filterNewsByCategory", () => {
  it("returns everything for 'all'", () => {
    expect(filterNewsByCategory(articles, "all")).toHaveLength(4);
  });

  it("returns only events", () => {
    const result = filterNewsByCategory(articles, "events");

    expect(result.map((entry) => entry.id)).toEqual(["salon", "installations"]);
  });

  it("returns only press", () => {
    const result = filterNewsByCategory(articles, "press");

    expect(result.map((entry) => entry.id)).toEqual(["gta", "partenariat"]);
  });

  it("returns nothing for a category nothing matches", () => {
    expect(filterNewsByCategory(articles, "webinars")).toEqual([]);
  });

  it("matches the machine value, never the French label", () => {
    expect(filterNewsByCategory(articles, "Événements")).toEqual([]);
    expect(filterNewsByCategory(articles, "Presse")).toEqual([]);
  });

  it("is case-sensitive, because the values are keys rather than prose", () => {
    expect(filterNewsByCategory(articles, "Events")).toEqual([]);
  });

  it("handles an empty article list", () => {
    expect(filterNewsByCategory([], "all")).toEqual([]);
    expect(filterNewsByCategory([], "events")).toEqual([]);
  });

  it("preserves order within a category", () => {
    const result = filterNewsByCategory(articles, "events");

    expect(result[0].id).toBe("salon");
    expect(result[1].id).toBe("installations");
  });

  it("does not mutate the input", () => {
    const input = [...articles];

    filterNewsByCategory(input, "events");

    expect(input).toEqual(articles);
  });

  it("returns the same reference for 'all', so React can skip re-rendering", () => {
    expect(filterNewsByCategory(articles, "all")).toBe(articles);
  });
});
