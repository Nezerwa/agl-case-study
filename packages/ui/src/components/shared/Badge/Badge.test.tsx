import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge — rendering", () => {
  it("renders its label", () => {
    render(<Badge>Événements</Badge>);

    expect(screen.getByText("Événements")).toBeInTheDocument();
  });

  it("merges a caller-supplied className", () => {
    const { container } = render(<Badge className="custom">Presse</Badge>);

    expect(container.firstElementChild).toHaveClass("custom");
  });
});

describe("Badge — not a control", () => {
  it("is not a button", () => {
    render(<Badge>Événements</Badge>);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("is not a link", () => {
    render(<Badge>Événements</Badge>);

    expect(screen.queryByRole("link")).toBeNull();
  });

  it("is not keyboard focusable", () => {
    const { container } = render(<Badge>Événements</Badge>);

    expect(container.firstElementChild).not.toHaveAttribute("tabindex");
  });
});

describe("Badge — variant and size", () => {
  it("applies distinct classes per variant", () => {
    const { container, rerender } = render(<Badge variant="solid">A</Badge>);
    const solid = container.firstElementChild?.className;

    rerender(<Badge variant="translucent">A</Badge>);

    expect(container.firstElementChild?.className).not.toBe(solid);
  });

  it("applies distinct classes per size", () => {
    const { container, rerender } = render(<Badge size="small">A</Badge>);
    const small = container.firstElementChild?.className;

    rerender(<Badge size="medium">A</Badge>);

    expect(container.firstElementChild?.className).not.toBe(small);
  });

  it("defaults to the card badge combination", () => {
    const { container, rerender } = render(<Badge>A</Badge>);
    const defaults = container.firstElementChild?.className;

    rerender(
      <Badge variant="solid" size="small">
        A
      </Badge>,
    );

    expect(container.firstElementChild?.className).toBe(defaults);
  });

  it("treats variant and size as independent axes", () => {
    const { container, rerender } = render(
      <Badge variant="translucent" size="small">
        A
      </Badge>,
    );
    const translucentSmall = container.firstElementChild?.className;

    rerender(
      <Badge variant="translucent" size="medium">
        A
      </Badge>,
    );

    expect(container.firstElementChild?.className).not.toBe(translucentSmall);
  });
});

describe("Badge — icon", () => {
  it("renders an icon before the label when supplied", () => {
    const { container } = render(
      <Badge icon={<svg data-testid="i" />}>Actualités</Badge>,
    );

    expect(container.firstElementChild?.firstElementChild).toBe(
      screen.getByTestId("i").parentElement,
    );
  });

  it("hides the icon from assistive technology", () => {
    render(<Badge icon={<svg data-testid="i" />}>Actualités</Badge>);

    expect(screen.getByTestId("i").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders no icon wrapper when none is supplied", () => {
    const { container } = render(<Badge>Actualités</Badge>);

    expect(container.querySelector("svg")).toBeNull();
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it("keeps the label readable alongside an icon", () => {
    render(<Badge icon={<svg data-testid="i" />}>Actualités</Badge>);

    expect(screen.getByText("Actualités")).toBeInTheDocument();
  });
});
