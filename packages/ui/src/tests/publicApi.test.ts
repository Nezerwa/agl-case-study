import { describe, expect, it } from "vitest";
import { SiteHeader, isActiveNavItem, normalizePath } from "../index";
import type { NavItem, SiteHeaderProps, SiteLogo } from "../index";

describe("@agl/ui public API", () => {
  it("exports components from the package root", () => {
    expect(SiteHeader).toBeTypeOf("function");
  });

  it("exports utilities from the package root", () => {
    expect(isActiveNavItem).toBeTypeOf("function");
    expect(normalizePath).toBeTypeOf("function");
  });

  it("exports component types from the same entry point", () => {
    const logo: SiteLogo = { src: "/logo.jpg", alt: "SOGECO" };
    const navItems: NavItem[] = [{ label: "Accueil", href: "/" }];
    const props: SiteHeaderProps = { logo, navItems, currentPath: "/" };

    expect(props.logo.alt).toBe("SOGECO");
    expect(props.navItems).toHaveLength(1);
  });
});
