import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteFooter } from "@agl/ui";
import type { FooterSection } from "@agl/ui";

const sections: FooterSection[] = [
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
      { id: "transport", label: "Transport Multimodal", href: "/services/transport" },
      { id: "oil-gaz", label: "Oil & Gaz", href: "/services/oil-gaz" },
      { id: "portuaire", label: "Opération Portuaire", href: "/services/portuaire" },
      { id: "projet", label: "Logistique de Projet", href: "/services/projet" },
      { id: "entreposage", label: "Entreposage", href: "/services/entreposage" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    links: [
      {
        id: "address",
        label: "PLOT 2150 PRIME ECONOMIC ZONE, Kigali, Rwanda",
        href: "https://www.google.com/maps/search/?api=1&query=Kigali",
        external: true,
      },
      { id: "phone", label: "+250 XX XX XX XX" },
      { id: "email", label: "contact@mail.com", href: "mailto:contact@mail.com" },
    ],
  },
];

const copyright =
  "© 2026 - Filiale du groupe Africa Global Logistics. Tous droits réservés.";

const meta = {
  title: "Modules/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
  args: { sections, copyright },
  argTypes: {
    sections: { control: "object" },
    copyright: { control: "text" },
    linkComponent: { table: { disable: true } },
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three columns at desktop: internal links, service links, contact details. */
export const Desktop: Story = {};

export const Tablet: Story = {
  globals: { viewport: { value: "tablet" } },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
};

/** With no sections the navigation landmark is omitted entirely. */
export const CopyrightOnly: Story = {
  args: { sections: [] },
};
