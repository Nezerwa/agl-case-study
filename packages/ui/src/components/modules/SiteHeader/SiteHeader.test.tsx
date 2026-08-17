import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "./SiteHeader";
import { isActiveNavItem, normalizePath } from "./SiteHeader.utils";
import type { NavItem, SiteLogo } from "./SiteHeader.types";

const logo: SiteLogo = {
  src: "/logo.jpg",
  alt: "AGL",
};

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Services", href: "/services" },
  { label: "Engagements", href: "/engagements" },
  { label: "Actualités", href: "/actualites" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Contact", href: "/contact" },
];

function renderHeader(currentPath = "/actualites", items: NavItem[] = navItems) {
  return render(
    <SiteHeader logo={logo} navItems={items} currentPath={currentPath} />,
  );
}

/**
 * jsdom applies the mobile-first `display: none` on the menu but cannot evaluate
 * the desktop media query that overrides it, so navigation links are always
 * outside the accessibility tree here. `hidden: true` includes them regardless of
 * that, which keeps these queries about markup rather than about CSS jsdom cannot run.
 */
function getNavLink(name: string) {
  return screen.getByRole("link", { name, hidden: true });
}

function queryNavLink(name: string) {
  return screen.queryByRole("link", { name, hidden: true });
}

function getMenu() {
  const button = screen.getByRole("button", { name: "Ouvrir le menu de navigation" });
  const menuId = button.getAttribute("aria-controls") ?? "";
  const menu = document.getElementById(menuId);

  if (!menu) {
    throw new Error("navigation menu not found");
  }

  return { button, menu };
}

describe("SiteHeader — navigation rendering", () => {
  it("renders every navigation item supplied through props", () => {
    renderHeader();

    for (const item of navItems) {
      expect(getNavLink(item.label)).toBeInTheDocument();
    }
  });

  it("renders each item exactly once, so desktop and mobile share one list", () => {
    renderHeader();

    const { menu } = getMenu();

    expect(within(menu).getAllByRole("link", { hidden: true })).toHaveLength(
      navItems.length,
    );
  });

  it("points each link at the href from props", () => {
    renderHeader();

    expect(getNavLink("Contact")).toHaveAttribute("href", "/contact");
  });

  it("does not hardcode page labels internally", () => {
    renderHeader("/tarifs", [{ label: "Tarifs", href: "/tarifs" }]);

    expect(getNavLink("Tarifs")).toBeInTheDocument();
    for (const item of navItems) {
      expect(queryNavLink(item.label)).toBeNull();
    }
  });

  it("labels the logo link and points it home", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "AGL" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

describe("SiteHeader — active route", () => {
  it("marks the current page with aria-current", () => {
    renderHeader("/actualites");

    expect(getNavLink("Actualités")).toHaveAttribute("aria-current", "page");
  });

  it("leaves every other item without aria-current", () => {
    renderHeader("/actualites");

    for (const item of navItems.filter((i) => i.href !== "/actualites")) {
      expect(getNavLink(item.label)).not.toHaveAttribute("aria-current");
    }
  });

  it("does not hardcode Actualités as active", () => {
    renderHeader("/contact");

    expect(getNavLink("Actualités")).not.toHaveAttribute("aria-current");
    expect(getNavLink("Contact")).toHaveAttribute("aria-current", "page");
  });

  it("keeps the parent item active on a nested route", () => {
    renderHeader("/actualites/mon-article");

    expect(getNavLink("Actualités")).toHaveAttribute("aria-current", "page");
  });
});

describe("isActiveNavItem", () => {
  it("matches an exact route", () => {
    expect(isActiveNavItem("/actualites", "/actualites")).toBe(true);
  });

  it("matches a nested route", () => {
    expect(isActiveNavItem("/actualites/mon-article", "/actualites")).toBe(true);
  });

  it("avoids the substring false positive", () => {
    expect(isActiveNavItem("/actualites-archive", "/actualites")).toBe(false);
  });

  it("avoids matching a shared prefix in the other direction", () => {
    expect(isActiveNavItem("/contact", "/contacts")).toBe(false);
  });

  it("only activates home on home", () => {
    expect(isActiveNavItem("/", "/")).toBe(true);
    expect(isActiveNavItem("/services", "/")).toBe(false);
  });

  it("ignores query strings and hashes", () => {
    expect(isActiveNavItem("/actualites?page=2", "/actualites")).toBe(true);
    expect(isActiveNavItem("/actualites#top", "/actualites")).toBe(true);
  });

  it("treats a trailing slash as the same route", () => {
    expect(isActiveNavItem("/actualites/", "/actualites")).toBe(true);
  });

  it("never activates an external URL", () => {
    expect(
      isActiveNavItem("/actualites", "https://example.com/actualites"),
    ).toBe(false);
    expect(isActiveNavItem("/actualites", "//example.com/actualites")).toBe(
      false,
    );
  });
});

describe("normalizePath", () => {
  it("strips query strings, hashes and trailing slashes", () => {
    expect(normalizePath("/actualites?page=2")).toBe("/actualites");
    expect(normalizePath("/actualites#top")).toBe("/actualites");
    expect(normalizePath("/actualites/")).toBe("/actualites");
  });

  it("keeps the root path intact", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("")).toBe("/");
  });
});

describe("SiteHeader — mobile menu", () => {
  it("starts closed", () => {
    renderHeader();

    const { button, menu } = getMenu();

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-open", "false");
  });

  it("opens when the menu button is pressed", async () => {
    renderHeader();

    const { button, menu } = getMenu();
    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveAttribute("data-open", "true");
  });

  it("closes when the menu button is pressed again", async () => {
    renderHeader();

    const { button, menu } = getMenu();
    await userEvent.click(button);
    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-open", "false");
  });

  it("closes when Escape is pressed", async () => {
    renderHeader();

    const { button, menu } = getMenu();
    await userEvent.click(button);
    await userEvent.keyboard("{Escape}");

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-open", "false");
  });

  it("closes when a navigation link is clicked", async () => {
    renderHeader();

    const { button, menu } = getMenu();
    await userEvent.click(button);
    await userEvent.click(getNavLink("Services"));

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-open", "false");
  });

  it("closes when the logo is clicked", async () => {
    renderHeader();

    const { button, menu } = getMenu();
    await userEvent.click(button);
    await userEvent.click(screen.getByRole("link", { name: "AGL" }));

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-open", "false");
  });

  it("wires the trigger to the menu it controls", () => {
    renderHeader();

    const { button, menu } = getMenu();

    expect(button).toHaveAttribute("aria-controls", menu.id);
  });

  it("does not duplicate navigation items when opened", async () => {
    renderHeader();

    const { button, menu } = getMenu();
    await userEvent.click(button);

    expect(within(menu).getAllByRole("link", { hidden: true })).toHaveLength(
      navItems.length,
    );
  });
});

describe("SiteHeader — accessibility", () => {
  it("exposes a labelled navigation landmark", () => {
    renderHeader();

    expect(
      screen.getByRole("navigation", { name: "Navigation principale" }),
    ).toBeInTheDocument();
  });

  it("renders a banner landmark", () => {
    renderHeader();

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
