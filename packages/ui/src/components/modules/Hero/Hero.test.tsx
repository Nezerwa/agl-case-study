import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the title as a level-one heading", () => {
    render(<Hero title="Nos Actualités" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow when provided", () => {
    render(<Hero eyebrow="AGL Group" title="Nos Actualités" />);

    expect(screen.getByText("AGL Group")).toBeInTheDocument();
  });

  it("omits the eyebrow when not provided", () => {
    render(<Hero title="Nos Actualités" />);

    expect(screen.queryByText("AGL Group")).not.toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<Hero title="Nos Actualités" description="Les dernières nouvelles" />);

    expect(screen.getByText("Les dernières nouvelles")).toBeInTheDocument();
  });

  it("renders only the heading when optional fields are absent", () => {
    const { container } = render(<Hero title="Nos Actualités" />);

    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
