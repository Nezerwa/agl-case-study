import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NewsCard } from "./NewsCard";
import type { NewsCardProps } from "./NewsCard.types";

const eventArticle: NewsCardProps = {
  image: { src: "/images/news/salon.jpg", alt: "Stand SOGECO au salon" },
  categoryLabel: "Événements",
  date: "12 mars 2026",
  title: "Salon International de la Logistique 2026",
  description: "SOGECO présente ses solutions logistiques intégrées.",
  href: "/actualites/salon-international-logistique-2026",
};

const pressArticle: NewsCardProps = {
  image: { src: "/images/news/gta.jpg", alt: "Terminal gazier GTA" },
  categoryLabel: "Presse",
  date: "4 février 2026",
  title: "SOGECO renforce sa position dans le projet gazier GTA",
  description: "Une nouvelle étape dans l'accompagnement du projet.",
  href: "/actualites/projet-gazier-gta",
};

function renderCard(overrides: Partial<NewsCardProps> = {}) {
  return render(<NewsCard {...eventArticle} {...overrides} />);
}

describe("NewsCard — content", () => {
  it("renders the image with its alt text", () => {
    renderCard();

    const image = screen.getByRole("img", { name: "Stand SOGECO au salon" });

    expect(image).toHaveAttribute("src", "/images/news/salon.jpg");
  });

  it("renders the category through a Badge rather than a control", () => {
    renderCard();

    const badge = screen.getByText("Événements");

    expect(badge).toBeInTheDocument();
    expect(badge.closest("button")).toBeNull();
    expect(badge.closest("a")).toBeNull();
  });

  it("renders the date", () => {
    renderCard();

    expect(screen.getByText("12 mars 2026")).toBeInTheDocument();
  });

  it("renders the title as a heading", () => {
    renderCard();

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Salon International de la Logistique 2026",
      }),
    ).toBeInTheDocument();
  });

  it("drops the heading to h2 when asked", () => {
    renderCard({ headingLevel: "h2" });

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("renders the description", () => {
    renderCard();

    expect(
      screen.getByText("SOGECO présente ses solutions logistiques intégrées."),
    ).toBeInTheDocument();
  });

  it("renders press content just as well as event content", () => {
    render(<NewsCard {...pressArticle} />);

    expect(screen.getByText("Presse")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "SOGECO renforce sa position dans le projet gazier GTA",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Terminal gazier GTA" })).toHaveAttribute(
      "src",
      "/images/news/gta.jpg",
    );
  });
});

describe("NewsCard — the read-more link", () => {
  it("renders a link, not a button", () => {
    renderCard();

    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("points at the article", () => {
    renderCard();

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/actualites/salon-international-logistique-2026",
    );
  });

  it("shows the short label but announces which article it opens", () => {
    renderCard();

    const link = screen.getByRole("link");

    expect(link).toHaveTextContent(/^Lire la suite/);
    expect(link).toHaveAccessibleName(
      "Lire la suite — Salon International de la Logistique 2026",
    );
  });

  it("keeps each link distinguishable when several cards sit together", () => {
    render(
      <>
        <NewsCard {...eventArticle} />
        <NewsCard {...pressArticle} />
      </>,
    );

    expect(
      screen.getByRole("link", {
        name: "Lire la suite — Salon International de la Logistique 2026",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Lire la suite — SOGECO renforce sa position dans le projet gazier GTA",
      }),
    ).toBeInTheDocument();
  });

  it("accepts a caller-supplied label", () => {
    renderCard({ readMoreLabel: "En savoir plus" });

    expect(screen.getByRole("link")).toHaveTextContent(/^En savoir plus/);
  });

  it("renders through an injected link component", () => {
    renderCard({
      linkComponent: ({ href, children, className }) => (
        <a data-testid="injected" href={href} className={className}>
          {children}
        </a>
      ),
    });

    expect(screen.getByTestId("injected")).toHaveAttribute(
      "href",
      "/actualites/salon-international-logistique-2026",
    );
  });
});

describe("NewsCard — semantics", () => {
  it("is an article", () => {
    renderCard();

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("exposes exactly one interactive element, so the card is not nested-clickable", () => {
    renderCard();

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("hides the calendar icon from assistive technology", () => {
    const { container } = renderCard();

    const dateIcon = container.querySelector("svg");

    expect(dateIcon?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("merges a caller-supplied className", () => {
    renderCard({ className: "custom" });

    expect(screen.getByRole("article")).toHaveClass("custom");
  });
});
