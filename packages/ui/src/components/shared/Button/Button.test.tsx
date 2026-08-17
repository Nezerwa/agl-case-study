import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button — rendering", () => {
  it("renders its label", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });

  it("renders a native button element", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button").tagName).toBe("BUTTON");
  });

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("respects an explicit type", () => {
    render(<Button type="submit">Envoyer</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("forwards arbitrary button attributes", () => {
    render(<Button name="action">Envoyer</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("name", "action");
  });
});

describe("Button — variant and size", () => {
  it("applies distinct classes per variant", () => {
    const { rerender } = render(<Button variant="primary">A</Button>);
    const primary = screen.getByRole("button").className;

    rerender(<Button variant="filter">A</Button>);
    const filter = screen.getByRole("button").className;

    rerender(<Button variant="link">A</Button>);
    const link = screen.getByRole("button").className;

    expect(new Set([primary, filter, link]).size).toBe(3);
  });

  it("applies distinct classes per size", () => {
    const { rerender } = render(<Button size="medium">A</Button>);
    const medium = screen.getByRole("button").className;

    rerender(<Button size="large">A</Button>);
    const large = screen.getByRole("button").className;

    expect(medium).not.toBe(large);
  });

  it("ignores size for the link variant, which has no box", () => {
    const { rerender } = render(
      <Button variant="link" size="medium">
        A
      </Button>,
    );
    const medium = screen.getByRole("button").className;

    rerender(
      <Button variant="link" size="large">
        A
      </Button>,
    );

    expect(screen.getByRole("button").className).toBe(medium);
  });

  it("merges a caller-supplied className", () => {
    render(<Button className="custom">A</Button>);

    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});

describe("Button — filter selection", () => {
  it("exposes aria-pressed on a filter", () => {
    render(
      <Button variant="filter" isSelected>
        Tous
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("reports an unselected filter as not pressed", () => {
    render(
      <Button variant="filter" isSelected={false}>
        Presse
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("changes class when selected", () => {
    const { rerender } = render(<Button variant="filter">Tous</Button>);
    const unselected = screen.getByRole("button").className;

    rerender(
      <Button variant="filter" isSelected>
        Tous
      </Button>,
    );

    expect(screen.getByRole("button").className).not.toBe(unselected);
  });

  it("does not put aria-pressed on non-filter variants", () => {
    render(<Button variant="primary">Envoyer</Button>);

    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });
});

describe("Button — icons", () => {
  it("renders an icon before the label by default", () => {
    render(<Button icon={<svg data-testid="i" />}>Envoyer</Button>);

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("i").parentElement;

    expect(button.firstElementChild).toBe(icon);
  });

  it("renders an icon after the label when asked", () => {
    render(
      <Button icon={<svg data-testid="i" />} iconPosition="right">
        Envoyer
      </Button>,
    );

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("i").parentElement;

    expect(button.lastElementChild).toBe(icon);
  });

  it("hides the icon from assistive technology", () => {
    render(<Button icon={<svg data-testid="i" />}>Envoyer</Button>);

    expect(screen.getByTestId("i").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps the accessible name from the label, not the icon", () => {
    render(<Button icon={<svg data-testid="i" />}>Envoyer</Button>);

    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });
});

describe("Button — disabled and loading", () => {
  it("is disabled when disabled is set", () => {
    render(<Button disabled>Envoyer</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Envoyer
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("is disabled and marked busy while loading", () => {
    render(<Button isLoading>Envoyer</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("keeps its accessible name while loading", () => {
    render(<Button isLoading>Envoi en cours</Button>);

    expect(
      screen.getByRole("button", { name: "Envoi en cours" }),
    ).toBeInTheDocument();
  });

  it("is not marked busy when idle", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });
});

describe("Button — interaction", () => {
  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Envoyer</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
