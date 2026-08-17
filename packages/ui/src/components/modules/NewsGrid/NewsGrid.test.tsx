import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NewsGrid } from "./NewsGrid";
import type { NewsGridItem } from "./NewsGrid.types";

function item(id: string, title: string, categoryLabel: string): NewsGridItem {
  return {
    id,
    image: { src: `/images/news/${id}.jpg`, alt: `Visuel ${title}` },
    categoryLabel,
    date: "12 mars 2026",
    title,
    description: "Description de l'article.",
    href: `/actualites/${id}`,
  };
}

const items: NewsGridItem[] = [
  item("salon", "Salon International de la Logistique 2026", "Événements"),
  item("gta", "SOGECO renforce sa position dans le projet gazier GTA", "Presse"),
  item("installations", "Inauguration de nouvelles installations", "Événements"),
];

describe("NewsGrid — rendering items", () => {
  it("renders one card per item", () => {
    render(<NewsGrid items={items} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("renders the titles it was given", () => {
    render(<NewsGrid items={items} />);

    for (const entry of items) {
      expect(
        screen.getByRole("heading", { name: entry.title }),
      ).toBeInTheDocument();
    }
  });

  it("hardcodes no articles of its own", () => {
    render(<NewsGrid items={[item("x", "Un seul article", "Presse")]} />);

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByText(/Salon International/)).toBeNull();
  });

  it("renders a list, so assistive technology can count the articles", () => {
    render(<NewsGrid items={items} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("gives every card a working link", () => {
    render(<NewsGrid items={items} />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(3);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/actualites/salon",
      "/actualites/gta",
      "/actualites/installations",
    ]);
  });

  it("keeps the order it was given", () => {
    render(<NewsGrid items={items} />);

    expect(
      screen.getAllByRole("heading").map((heading) => heading.textContent),
    ).toEqual(items.map((entry) => entry.title));
  });

  it("re-renders cleanly when the item set shrinks, as filtering will do", () => {
    const { rerender } = render(<NewsGrid items={items} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);

    rerender(<NewsGrid items={items.filter((e) => e.categoryLabel === "Presse")} />);

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Presse")).toBeInTheDocument();
    expect(screen.queryByText("Événements")).toBeNull();
  });
});

describe("NewsGrid — empty state", () => {
  it("shows a message instead of an empty grid", () => {
    render(<NewsGrid items={[]} />);

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByRole("list")).toBeNull();
    expect(
      screen.getByText("Aucune actualité dans cette catégorie."),
    ).toBeInTheDocument();
  });

  it("announces the empty state, because filtering changes it without a reload", () => {
    render(<NewsGrid items={[]} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("accepts a caller-supplied message", () => {
    render(<NewsGrid items={[]} emptyMessage="Rien à afficher pour le moment." />);

    expect(screen.getByText("Rien à afficher pour le moment.")).toBeInTheDocument();
  });
});

describe("NewsGrid — pass-through", () => {
  it("names its region", () => {
    render(<NewsGrid items={items} ariaLabel="Dernières actualités" />);

    expect(
      screen.getByRole("region", { name: "Dernières actualités" }),
    ).toBeInTheDocument();
  });

  it("applies one heading level to every card", () => {
    render(<NewsGrid items={items} headingLevel="h2" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });

  it("hands its link component down to every card", () => {
    render(
      <NewsGrid
        items={items}
        linkComponent={({ href, children, className }) => (
          <a data-testid="injected" href={href} className={className}>
            {children}
          </a>
        )}
      />,
    );

    expect(screen.getAllByTestId("injected")).toHaveLength(3);
  });

  it("knows nothing about categories beyond displaying their labels", () => {
    render(<NewsGrid items={items} />);

    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
