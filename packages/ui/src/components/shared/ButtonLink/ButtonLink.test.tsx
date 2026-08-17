import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonLink } from "./ButtonLink";
import type { NavLinkProps } from "../../../types/link.types";

describe("ButtonLink — semantics", () => {
  it("renders a link, not a button", () => {
    render(<ButtonLink href="/actualites">Lire la suite</ButtonLink>);

    expect(
      screen.getByRole("link", { name: "Lire la suite" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("preserves the href", () => {
    render(<ButtonLink href="/actualites/mon-article">Lire</ButtonLink>);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/actualites/mon-article",
    );
  });

  it("carries no target or rel for internal links", () => {
    render(<ButtonLink href="/actualites">Lire</ButtonLink>);

    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });
});

describe("ButtonLink — link component injection", () => {
  it("renders through the supplied linkComponent", () => {
    const CustomLink = vi.fn(({ href, children, className }: NavLinkProps) => (
      <a href={href} className={className} data-custom="true">
        {children}
      </a>
    ));

    render(
      <ButtonLink href="/actualites" linkComponent={CustomLink}>
        Lire
      </ButtonLink>,
    );

    expect(CustomLink).toHaveBeenCalled();
    expect(screen.getByRole("link")).toHaveAttribute("data-custom", "true");
  });

  it("bypasses the injected component for external links", () => {
    const CustomLink = vi.fn(({ href, children }: NavLinkProps) => (
      <a href={href} data-custom="true">
        {children}
      </a>
    ));

    render(
      <ButtonLink href="https://example.com" external linkComponent={CustomLink}>
        Externe
      </ButtonLink>,
    );

    expect(screen.getByRole("link")).not.toHaveAttribute("data-custom");
  });

  it("opens external links safely and announces the new window", () => {
    render(
      <ButtonLink href="https://example.com" external>
        Externe
      </ButtonLink>,
    );

    const link = screen.getByRole("link", { name: /nouvelle fenêtre/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("ButtonLink — icons and styling", () => {
  it("renders the icon after the label by default", () => {
    render(
      <ButtonLink href="/a" icon={<svg data-testid="i" />}>
        Lire la suite
      </ButtonLink>,
    );

    const link = screen.getByRole("link");
    expect(link.lastElementChild).toBe(screen.getByTestId("i").parentElement);
  });

  it("renders the icon before the label when asked", () => {
    render(
      <ButtonLink href="/a" icon={<svg data-testid="i" />} iconPosition="left">
        Lire la suite
      </ButtonLink>,
    );

    const link = screen.getByRole("link");
    expect(link.firstElementChild).toBe(screen.getByTestId("i").parentElement);
  });

  it("hides the icon from assistive technology", () => {
    render(
      <ButtonLink href="/a" icon={<svg data-testid="i" />}>
        Lire
      </ButtonLink>,
    );

    expect(screen.getByTestId("i").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("shares Button styling across variants", () => {
    const { rerender } = render(
      <ButtonLink href="/a" variant="link">
        A
      </ButtonLink>,
    );
    const link = screen.getByRole("link").className;

    rerender(
      <ButtonLink href="/a" variant="primary" size="large">
        A
      </ButtonLink>,
    );

    expect(screen.getByRole("link").className).not.toBe(link);
  });

  it("merges a caller-supplied className", () => {
    render(
      <ButtonLink href="/a" className="custom">
        A
      </ButtonLink>,
    );

    expect(screen.getByRole("link")).toHaveClass("custom");
  });
});
