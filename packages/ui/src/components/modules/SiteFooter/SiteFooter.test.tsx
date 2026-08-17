import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";
import type { FooterSection } from "./SiteFooter.types";
import type { NavLinkProps } from "../../../types/link.types";

const sections: FooterSection[] = [
  {
    id: "navigation",
    title: "Navigation",
    links: [
      { id: "a-propos", label: "À propos", href: "/a-propos" },
      { id: "services", label: "Services", href: "/services" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    links: [
      {
        id: "address",
        label: "PLOT 2150 PRIME ECONOMIC ZONE, Kigali, Rwanda",
        href: "https://maps.google.com/",
        external: true,
        iconSrc: "/icons/location.svg",
      },
      { id: "phone", label: "+250 XX XX XX XX", iconSrc: "/icons/phone.svg" },
      {
        id: "email",
        label: "contact@mail.com",
        href: "mailto:contact@mail.com",
        iconSrc: "/icons/mail.svg",
      },
    ],
  },
];

const copyright = "© 2026 - Filiale du groupe Africa Global Logistics.";

function renderFooter(props: Partial<Parameters<typeof SiteFooter>[0]> = {}) {
  return render(
    <SiteFooter sections={sections} copyright={copyright} {...props} />,
  );
}

describe("SiteFooter — content from props", () => {
  it("renders every section heading", () => {
    renderFooter();

    expect(
      screen.getByRole("heading", { level: 2, name: "Navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Contact" }),
    ).toBeInTheDocument();
  });

  it("renders every link supplied through props", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: /À propos/ })).toHaveAttribute(
      "href",
      "/a-propos",
    );
    expect(screen.getByRole("link", { name: /Services/ })).toHaveAttribute(
      "href",
      "/services",
    );
  });

  it("renders the copyright", () => {
    renderFooter();

    expect(screen.getByText(copyright)).toBeInTheDocument();
  });

  it("does not hardcode any labels internally", () => {
    renderFooter({
      sections: [
        {
          id: "only",
          title: "Ressources",
          links: [{ id: "faq", label: "FAQ", href: "/faq" }],
        },
      ],
      copyright: "Autre mention",
    });

    expect(screen.getByRole("heading", { name: "Ressources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FAQ" })).toBeInTheDocument();
    expect(screen.queryByText("Navigation")).toBeNull();
    expect(screen.queryByText(copyright)).toBeNull();
  });

  it("renders one list item per link", () => {
    renderFooter();

    const nav = screen.getByRole("navigation", {
      name: "Navigation du pied de page",
    });

    expect(within(nav).getAllByRole("listitem")).toHaveLength(5);
  });
});

describe("SiteFooter — optional content", () => {
  it("omits the navigation entirely when there are no sections", () => {
    renderFooter({ sections: [] });

    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.getByText(copyright)).toBeInTheDocument();
  });

  it("renders an item without href as plain text, not a link", () => {
    renderFooter();

    expect(screen.getByText("+250 XX XX XX XX")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /\+250/ })).toBeNull();
  });

  it("renders a mailto: item as a link without new-tab handling", () => {
    renderFooter();

    const email = screen.getByRole("link", { name: /contact@mail\.com/ });

    expect(email).toHaveAttribute("href", "mailto:contact@mail.com");
    expect(email).not.toHaveAttribute("target");
    expect(email).not.toHaveAttribute("rel");
  });

  it("renders a leading icon only when one is supplied", () => {
    const { container } = renderFooter();

    const icons = container.querySelectorAll("img");
    expect(icons).toHaveLength(3);
    expect(icons[0]).toHaveAttribute("src", "/icons/location.svg");
  });

  it("hides decorative icons from assistive technology", () => {
    const { container } = renderFooter();

    for (const icon of container.querySelectorAll("img")) {
      expect(icon).toHaveAttribute("alt", "");
    }

    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });
});

describe("SiteFooter — external links", () => {
  it("opens external links in a new tab with a safe rel", () => {
    renderFooter();

    const address = screen.getByRole("link", { name: /PLOT 2150/ });

    expect(address).toHaveAttribute("target", "_blank");
    expect(address).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("announces that an external link opens a new window", () => {
    renderFooter();

    expect(
      screen.getByRole("link", { name: /nouvelle fenêtre/ }),
    ).toBeInTheDocument();
  });

  it("leaves internal links without target or rel", () => {
    renderFooter();

    const internal = screen.getByRole("link", { name: /À propos/ });

    expect(internal).not.toHaveAttribute("target");
    expect(internal).not.toHaveAttribute("rel");
  });
});

describe("SiteFooter — link component injection", () => {
  it("renders through the supplied linkComponent", () => {
    const CustomLink = vi.fn(({ href, children }: NavLinkProps) => (
      <a href={href} data-custom="true">
        {children}
      </a>
    ));

    renderFooter({ linkComponent: CustomLink });

    expect(CustomLink).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /À propos/ })).toHaveAttribute(
      "data-custom",
      "true",
    );
  });

  it("falls back to a plain anchor when none is supplied", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: /À propos/ }).tagName).toBe("A");
  });

  it("bypasses the injected component for external links", () => {
    const CustomLink = vi.fn(({ href, children }: NavLinkProps) => (
      <a href={href} data-custom="true">
        {children}
      </a>
    ));

    renderFooter({ linkComponent: CustomLink });

    expect(
      screen.getByRole("link", { name: /PLOT 2150/ }),
    ).not.toHaveAttribute("data-custom");
  });
});

describe("SiteFooter — landmarks", () => {
  it("renders a contentinfo landmark targetable by a skip link", () => {
    renderFooter();

    expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "footer");
  });

  it("labels the footer navigation", () => {
    renderFooter({ navLabel: "Liens du pied de page" });

    expect(
      screen.getByRole("navigation", { name: "Liens du pied de page" }),
    ).toBeInTheDocument();
  });
});
