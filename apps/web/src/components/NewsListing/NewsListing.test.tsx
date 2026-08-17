import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CategoryOption } from "@agl/ui";
import { NewsListing } from "./NewsListing";
import type { NewsArticle } from "./NewsListing.types";

const categories: CategoryOption[] = [
  { id: "all", label: "Tous", value: "all" },
  { id: "events", label: "Événements", value: "events" },
  { id: "press", label: "Presse", value: "press" },
];

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
];

function renderListing(overrides: Partial<Parameters<typeof NewsListing>[0]> = {}) {
  return render(
    <NewsListing categories={categories} articles={articles} {...overrides} />,
  );
}

describe("NewsListing — initial render", () => {
  it("shows every article under the default category", () => {
    renderListing({ initialCategory: "all" });

    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("starts on the authored default category", () => {
    renderListing({ initialCategory: "press" });

    expect(screen.getByRole("button", { name: "Presse" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("falls back to the first category when none is authored", () => {
    renderListing();

    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("NewsListing — selecting a category changes the cards", () => {
  it("narrows to events", async () => {
    renderListing({ initialCategory: "all" });

    await userEvent.click(screen.getByRole("button", { name: "Événements" }));

    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Article salon" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Article gta" })).toBeNull();
  });

  it("narrows to press", async () => {
    renderListing({ initialCategory: "all" });

    await userEvent.click(screen.getByRole("button", { name: "Presse" }));

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Article gta" })).toBeInTheDocument();
  });

  it("moves the pressed state with the selection", async () => {
    renderListing({ initialCategory: "all" });

    await userEvent.click(screen.getByRole("button", { name: "Presse" }));

    expect(screen.getByRole("button", { name: "Presse" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("returns to the full list", async () => {
    renderListing({ initialCategory: "press" });

    expect(screen.getAllByRole("article")).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: "Tous" }));

    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("shows the empty state when a category has no articles", async () => {
    renderListing({
      initialCategory: "all",
      articles: [article("salon", "events", "Événements")],
    });

    await userEvent.click(screen.getByRole("button", { name: "Presse" }));

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

describe("NewsListing — layer boundaries", () => {
  it("filters on the machine value, so labels can be renamed freely", async () => {
    renderListing({
      initialCategory: "all",
      categories: [
        { id: "all", label: "Tout voir", value: "all" },
        { id: "events", label: "Nos rendez-vous", value: "events" },
      ],
    });

    await userEvent.click(screen.getByRole("button", { name: "Nos rendez-vous" }));

    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("renders the filter above the grid", () => {
    const { container } = renderListing();

    const group = container.querySelector('[role="group"]');
    const grid = container.querySelector("section");

    expect(group?.compareDocumentPosition(grid as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
