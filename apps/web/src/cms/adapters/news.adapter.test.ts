import { describe, expect, it } from "vitest";
import type { CmsComponent } from "@agl/cms-types";
import { mapNewsArticles, mapNewsListing } from "./news.adapter";

function listingComponent(fields: CmsComponent["fields"]): CmsComponent {
  return { uid: "u1", componentName: "NewsListing", fields };
}

function withArticles(value: unknown): CmsComponent {
  return listingComponent({ articles: { value } });
}

const salon = {
  id: "salon-2026",
  category: "events",
  categoryLabel: "Événements",
  date: "12 mars 2026",
  title: "Salon International de la Logistique 2026",
  description: "SOGECO y présente ses solutions.",
  image: { src: "/images/news/salon.jpg", alt: "Stand SOGECO" },
  href: "/actualites/salon-2026",
};

describe("mapNewsArticles", () => {
  it("maps a complete CMS article", () => {
    expect(mapNewsArticles(withArticles([salon]))[0]).toEqual({
      id: "salon-2026",
      category: "events",
      categoryLabel: "Événements",
      date: "12 mars 2026",
      title: "Salon International de la Logistique 2026",
      description: "SOGECO y présente ses solutions.",
      image: { src: "/images/news/salon.jpg", alt: "Stand SOGECO" },
      href: "/actualites/salon-2026",
    });
  });

  it("maps the image as a nested object, not two loose fields", () => {
    expect(mapNewsArticles(withArticles([salon]))[0].image).toEqual({
      src: "/images/news/salon.jpg",
      alt: "Stand SOGECO",
    });
  });

  it("keeps the machine category separate from the display label", () => {
    const article = mapNewsArticles(withArticles([salon]))[0];

    expect(article.category).toBe("events");
    expect(article.categoryLabel).toBe("Événements");
  });

  it("maps the href through untouched", () => {
    expect(mapNewsArticles(withArticles([salon]))[0].href).toBe(
      "/actualites/salon-2026",
    );
  });

  it("keeps the authored order", () => {
    const articles = mapNewsArticles(
      withArticles([salon, { ...salon, id: "second" }]),
    );

    expect(articles.map((article) => article.id)).toEqual(["salon-2026", "second"]);
  });

  it("trims surrounding whitespace", () => {
    const articles = mapNewsArticles(
      withArticles([{ ...salon, title: "  Salon  ", href: " /a " }]),
    );

    expect(articles[0].title).toBe("Salon");
    expect(articles[0].href).toBe("/a");
  });
});

describe("mapNewsArticles — malformed content", () => {
  it("returns an empty list when the field is absent", () => {
    expect(mapNewsArticles(listingComponent({}))).toEqual([]);
  });

  it("returns an empty list when the field is not an array", () => {
    expect(mapNewsArticles(withArticles("nope"))).toEqual([]);
    expect(mapNewsArticles(withArticles(null))).toEqual([]);
  });

  it("drops entries that are not objects", () => {
    expect(mapNewsArticles(withArticles(["a", 3, null, salon]))).toHaveLength(1);
  });

  it("drops an article with no id, because the list cannot key on it", () => {
    const { id, ...withoutId } = salon;

    expect(id).toBeDefined();
    expect(mapNewsArticles(withArticles([withoutId]))).toEqual([]);
  });

  it("drops an article with no title or no href", () => {
    const { title, ...withoutTitle } = salon;
    const { href, ...withoutHref } = salon;

    expect(title && href).toBeTruthy();
    expect(mapNewsArticles(withArticles([withoutTitle]))).toEqual([]);
    expect(mapNewsArticles(withArticles([withoutHref]))).toEqual([]);
  });

  it("drops an article whose image has no src", () => {
    expect(
      mapNewsArticles(withArticles([{ ...salon, image: { alt: "x" } }])),
    ).toEqual([]);
    expect(mapNewsArticles(withArticles([{ ...salon, image: null }]))).toEqual([]);
  });

  it("accepts an empty alt, which marks the image decorative", () => {
    const articles = mapNewsArticles(
      withArticles([{ ...salon, image: { src: "/a.jpg" } }]),
    );

    expect(articles[0].image.alt).toBe("");
  });

  it("falls back to 'all' so a miscategorised article is not invisible", () => {
    const { category, ...withoutCategory } = salon;

    expect(category).toBe("events");
    expect(mapNewsArticles(withArticles([withoutCategory]))[0].category).toBe("all");
  });

  it("tolerates a missing date or description", () => {
    const { date, description, ...sparse } = salon;

    expect(date && description).toBeTruthy();

    const article = mapNewsArticles(withArticles([sparse]))[0];

    expect(article.date).toBe("");
    expect(article.description).toBe("");
  });

  it("does not read inherited properties", () => {
    expect(mapNewsArticles(withArticles([Object.create(salon)]))).toEqual([]);
  });
});

describe("mapNewsListing", () => {
  it("maps categories and articles from one datasource", () => {
    const props = mapNewsListing(
      listingComponent({
        defaultCategory: { value: "all" },
        categories: { value: [{ id: "all", label: "Tous", value: "all" }] },
        articles: { value: [salon] },
      }),
    );

    expect(props.categories).toHaveLength(1);
    expect(props.articles).toHaveLength(1);
    expect(props.initialCategory).toBe("all");
  });

  it("passes through the authored labels and messages", () => {
    const props = mapNewsListing(
      listingComponent({
        filterAriaLabel: { value: "Filtrer par thème" },
        gridAriaLabel: { value: "Dernières actualités" },
        emptyMessage: { value: "Rien pour l'instant." },
      }),
    );

    expect(props.filterAriaLabel).toBe("Filtrer par thème");
    expect(props.gridAriaLabel).toBe("Dernières actualités");
    expect(props.emptyMessage).toBe("Rien pour l'instant.");
  });

  it("leaves optional values undefined so the components use their defaults", () => {
    const props = mapNewsListing(listingComponent({}));

    expect(props.initialCategory).toBeUndefined();
    expect(props.emptyMessage).toBeUndefined();
    expect(props.categories).toEqual([]);
    expect(props.articles).toEqual([]);
  });
});
