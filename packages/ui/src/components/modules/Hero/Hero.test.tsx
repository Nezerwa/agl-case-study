import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero — title and heading semantics", () => {
  it("renders the title", () => {
    render(<Hero title="Nos Actualités" />);

    expect(screen.getByText("Nos Actualités")).toBeInTheDocument();
  });

  it("renders an h1 by default", () => {
    render(<Hero title="Nos Actualités" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
  });

  it("renders an h2 when asked", () => {
    render(<Hero title="Restez informé" headingLevel="h2" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Restez informé" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });
});

describe("Hero — optional description", () => {
  it("renders the description when supplied", () => {
    render(<Hero title="T" description="Découvrez les dernières nouvelles" />);

    expect(
      screen.getByText("Découvrez les dernières nouvelles"),
    ).toBeInTheDocument();
  });

  it("renders no paragraph when the description is absent", () => {
    const { container } = render(<Hero title="T" />);

    expect(container.querySelector("p")).toBeNull();
  });
});

describe("Hero — optional badge", () => {
  it("renders the badge when supplied", () => {
    render(<Hero title="T" badge={{ label: "Actualités" }} />);

    expect(screen.getByText("Actualités")).toBeInTheDocument();
  });

  it("renders no badge when absent", () => {
    render(<Hero title="T" />);

    expect(screen.queryByText("Actualités")).toBeNull();
  });

  it("renders the badge icon hidden from assistive technology", () => {
    render(
      <Hero
        title="T"
        badge={{ label: "Actualités", icon: <svg data-testid="i" /> }}
      />,
    );

    expect(screen.getByTestId("i").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

describe("Hero — presentational only", () => {
  it("renders no interactive element, with or without a badge", () => {
    const { rerender } = render(<Hero title="T" description="D" />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();

    rerender(<Hero title="T" description="D" badge={{ label: "Actualités" }} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("Hero — alignment and variant", () => {
  it("applies distinct classes per alignment", () => {
    const { container, rerender } = render(<Hero title="T" align="left" />);
    const left = container.querySelector("section")?.innerHTML;
    const leftClass = container.querySelector("section > div")?.className;

    rerender(<Hero title="T" align="center" />);

    expect(container.querySelector("section > div")?.className).not.toBe(
      leftClass,
    );
    expect(container.querySelector("section")?.innerHTML).not.toBe(left);
  });

  it("applies distinct classes per variant", () => {
    const { container, rerender } = render(<Hero title="T" variant="brand" />);
    const brand = container.querySelector("section")?.className;

    rerender(<Hero title="T" variant="surface" />);

    expect(container.querySelector("section")?.className).not.toBe(brand);
  });

  it("merges a caller-supplied className", () => {
    const { container } = render(<Hero title="T" className="custom" />);

    expect(container.querySelector("section")).toHaveClass("custom");
  });

  it("applies distinct classes per size without touching the type scale", () => {
    const { container, rerender } = render(
      <Hero title="Restez informé" headingLevel="h2" size="default" />,
    );
    const defaultClass = container.querySelector("section")?.className;

    rerender(<Hero title="Restez informé" headingLevel="h2" size="large" />);

    expect(container.querySelector("section")?.className).not.toBe(defaultClass);
    expect(
      screen.getByRole("heading", { level: 2, name: "Restez informé" }),
    ).toBeInTheDocument();
  });

  it("treats variant, align and headingLevel as independent axes", () => {
    const { container, rerender } = render(
      <Hero title="T" variant="brand" align="left" headingLevel="h1" />,
    );
    const first = container.innerHTML;

    rerender(
      <Hero title="T" variant="surface" align="center" headingLevel="h2" />,
    );

    expect(container.innerHTML).not.toBe(first);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
