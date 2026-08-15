import { describe, expect, it } from "vitest";
import { Button, Hero } from "../index";
import type { ButtonProps, ButtonVariant, HeroProps } from "../index";

describe("@agl/ui public API", () => {
  it("exports components from the package root", () => {
    expect(Button).toBeTypeOf("function");
    expect(Hero).toBeTypeOf("function");
  });

  it("exports component prop types from the same entry point", () => {
    const variant: ButtonVariant = "secondary";
    const buttonProps: ButtonProps = { children: "Envoyer", variant };
    const heroProps: HeroProps = { title: "Nos Actualités" };

    expect(buttonProps.variant).toBe("secondary");
    expect(heroProps.title).toBe("Nos Actualités");
  });
});
