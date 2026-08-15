import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CmsComponent } from "@agl/cms-types";
import { CmsComponentRenderer } from "./CmsComponentRenderer";

const heroComponent: CmsComponent = {
  uid: "u1",
  componentName: "Hero",
  fields: {
    eyebrow: { value: "AGL Group" },
    title: { value: "Nos Actualités" },
  },
};

describe("CmsComponentRenderer", () => {
  it("renders a registered component with adapted props", () => {
    render(<CmsComponentRenderer component={heroComponent} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
    expect(screen.getByText("AGL Group")).toBeInTheDocument();
  });

  it("falls back to the unknown-component notice for an unregistered name", () => {
    const component: CmsComponent = {
      uid: "u2",
      componentName: "NewsletterBanner",
      fields: {},
    };

    render(<CmsComponentRenderer component={component} />);

    expect(screen.getByRole("note")).toHaveTextContent("NewsletterBanner");
  });

  it("does not throw when a registered component receives empty fields", () => {
    const component: CmsComponent = {
      uid: "u3",
      componentName: "Hero",
      fields: {},
    };

    expect(() =>
      render(<CmsComponentRenderer component={component} />),
    ).not.toThrow();
  });
});
