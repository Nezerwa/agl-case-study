import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CmsComponent } from "@agl/cms-types";
import { CmsComponentRenderer } from "./CmsComponentRenderer";

function cmsComponent(componentName: string): CmsComponent {
  return {
    uid: "u1",
    componentName,
    fields: { title: { value: "Nos Actualités" } },
  };
}

describe("CmsComponentRenderer", () => {
  it("renders a registered component with adapted props", () => {
    render(<CmsComponentRenderer component={cmsComponent("Hero")} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("falls back to the unknown-component notice for an unregistered name", () => {
    render(
      <CmsComponentRenderer component={cmsComponent("NewsletterBanner")} />,
    );

    expect(screen.getByRole("note")).toHaveTextContent("NewsletterBanner");
  });

  it("names the component that is missing, so the gap is diagnosable", () => {
    render(<CmsComponentRenderer component={cmsComponent("NewsGrid")} />);

    expect(screen.getByRole("note")).toHaveTextContent("NewsGrid");
  });

  it("renders a registered component that owns state", () => {
    const component: CmsComponent = {
      uid: "u3",
      componentName: "NewsListing",
      fields: {
        categories: { value: [{ id: "all", label: "Tous", value: "all" }] },
        articles: {
          value: [
            {
              id: "salon",
              category: "events",
              categoryLabel: "Événements",
              title: "Salon International de la Logistique 2026",
              href: "/actualites/salon",
              image: { src: "/images/news/salon.png", alt: "Visuel de l'article" },
            },
          ],
        },
      },
    };

    render(<CmsComponentRenderer component={component} />);

    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("does not throw when a registered component receives empty fields", () => {
    const component: CmsComponent = {
      uid: "u2",
      componentName: "Hero",
      fields: {},
    };

    expect(() =>
      render(<CmsComponentRenderer component={component} />),
    ).not.toThrow();
  });
});
