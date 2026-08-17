import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteLayout } from "./SiteLayout";

vi.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/actualites" }),
}));

function renderLayout() {
  return render(
    <SiteLayout>
      <p>Contenu de la page</p>
    </SiteLayout>,
  );
}

function getHeaderNav() {
  return screen.getByRole("navigation", { name: "Navigation principale" });
}

function getFooterNav() {
  return screen.getByRole("navigation", {
    name: "Navigation du pied de page",
  });
}

describe("SiteLayout", () => {
  it("renders the site header above the page content", () => {
    renderLayout();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Contenu de la page")).toBeInTheDocument();
  });

  it("owns the single main landmark the skip link targets", () => {
    renderLayout();

    const main = screen.getByRole("main");

    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveTextContent("Contenu de la page");
  });

  it("exposes a skip link pointing at the main landmark", () => {
    renderLayout();

    expect(
      screen.getByRole("link", { name: "Aller au contenu principal" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("marks the current route as active in the header only", () => {
    renderLayout();

    const headerLink = within(getHeaderNav()).getByRole("link", {
      name: "Actualités",
      hidden: true,
    });
    const footerLink = within(getFooterNav()).getByRole("link", {
      name: "Actualités",
    });

    expect(headerLink).toHaveAttribute("aria-current", "page");
    expect(footerLink).not.toHaveAttribute("aria-current");
  });

  it("renders header navigation supplied by the site config", () => {
    renderLayout();

    const headerNav = getHeaderNav();

    for (const label of [
      "Accueil",
      "À propos",
      "Services",
      "Engagements",
      "Actualités",
      "Nous rejoindre",
      "Contact",
    ]) {
      expect(
        within(headerNav).getByRole("link", { name: label, hidden: true }),
      ).toBeInTheDocument();
    }
  });

  it("renders the site footer below the page content", () => {
    renderLayout();

    expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "footer");
  });

  it("renders footer sections supplied by the site config", () => {
    renderLayout();

    for (const title of ["Navigation", "Nos Services", "Contact"]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument();
    }
  });

  it("renders the copyright from the site config", () => {
    renderLayout();

    expect(
      screen.getByText(/Filiale du groupe Africa Global Logistics/),
    ).toBeInTheDocument();
  });

  it("passes the Next.js link adapter to both header and footer", () => {
    renderLayout();

    expect(
      within(getHeaderNav()).getByRole("link", {
        name: "Contact",
        hidden: true,
      }),
    ).toHaveAttribute("href", "/contact");
    expect(
      within(getFooterNav()).getByRole("link", { name: "Entreposage" }),
    ).toHaveAttribute("href", "/services/entreposage");
  });
});
