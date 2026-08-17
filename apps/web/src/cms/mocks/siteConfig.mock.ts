import type { SiteConfig } from "../siteConfig.types";

export const siteConfigMock: SiteConfig = {
  header: {
    logo: {
      src: "/logo.jpg",
      alt: "SOGECO",
    },
    navItems: [
      { label: "Accueil", href: "/" },
      { label: "À propos", href: "/a-propos" },
      { label: "Services", href: "/services" },
      { label: "Engagements", href: "/engagements" },
      { label: "Actualités", href: "/actualites" },
      { label: "Nous rejoindre", href: "/nous-rejoindre" },
      { label: "Contact", href: "/contact" },
    ],
  },
  footer: {
    sections: [
      {
        id: "navigation",
        title: "Navigation",
        links: [
          { id: "a-propos", label: "À propos", href: "/a-propos" },
          { id: "services", label: "Services", href: "/services" },
          { id: "engagements", label: "Engagements", href: "/engagements" },
          { id: "actualites", label: "Actualités", href: "/actualites" },
        ],
      },
      {
        id: "nos-services",
        title: "Nos Services",
        links: [
          {
            id: "transport-multimodal",
            label: "Transport Multimodal",
            href: "/services/transport-multimodal",
          },
          { id: "oil-gaz", label: "Oil & Gaz", href: "/services/oil-gaz" },
          {
            id: "operation-portuaire",
            label: "Opération Portuaire",
            href: "/services/operation-portuaire",
          },
          {
            id: "logistique-de-projet",
            label: "Logistique de Projet",
            href: "/services/logistique-de-projet",
          },
          {
            id: "entreposage",
            label: "Entreposage",
            href: "/services/entreposage",
          },
        ],
      },
      {
        id: "contact",
        title: "Contact",
        links: [
          {
            id: "address",
            label: "PLOT 2150 PRIME ECONOMIC ZONE, Kigali, Rwanda",
            href: "https://www.google.com/maps/search/?api=1&query=PLOT+2150+PRIME+ECONOMIC+ZONE%2C+Kigali%2C+Rwanda",
            external: true,
            iconSrc: "/icons/location.svg",
          },
          {
            id: "phone",
            label: "+250 XX XX XX XX",
            iconSrc: "/icons/phone.svg",
          },
          {
            id: "email",
            label: "contact@mail.com",
            href: "mailto:contact@mail.com",
            iconSrc: "/icons/mail.svg",
          },
        ],
      },
    ],
    copyright:
      "© 2026 - Filiale du groupe Africa Global Logistics. Tous droits réservés.",
  },
};
