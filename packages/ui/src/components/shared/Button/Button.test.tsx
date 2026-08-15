import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });

  it("applies the primary variant by default", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button")).toHaveClass("button", "primary");
  });

  it("applies the secondary variant when asked", () => {
    render(<Button variant="secondary">Annuler</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("secondary");
    expect(button).not.toHaveClass("primary");
  });

  it("merges a caller-supplied className", () => {
    render(<Button className="custom">Envoyer</Button>);

    expect(screen.getByRole("button")).toHaveClass("button", "custom");
  });

  it("is disabled when disabled is set", () => {
    render(<Button disabled>Envoyer</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled and marked busy while loading", () => {
    render(<Button isLoading>Envoyer</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("is not marked busy when idle", () => {
    render(<Button>Envoyer</Button>);

    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });

  it("forwards click events", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Envoyer</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire click events while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Envoyer
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards arbitrary button attributes", () => {
    render(<Button type="submit">Envoyer</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
