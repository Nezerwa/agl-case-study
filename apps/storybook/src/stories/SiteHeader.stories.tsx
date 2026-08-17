import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteHeader } from "@agl/ui";
import type { NavItem } from "@agl/ui";

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Services", href: "/services" },
  { label: "Engagements", href: "/engagements" },
  { label: "Actualités", href: "/actualites" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Contact", href: "/contact" },
];

const meta = {
  title: "Modules/SiteHeader",
  component: SiteHeader,
  parameters: { layout: "fullscreen" },
  args: {
    logo: { src: "/logo.jpg", alt: "SOGECO" },
    navItems,
    currentPath: "/actualites",
  },
  argTypes: {
    currentPath: {
      control: "select",
      options: navItems.map((item) => item.href),
      description: "Options come from the default navItems; edit as text after changing them.",
    },
    logo: { control: "object" },
    navItems: { control: "object" },
    linkComponent: { table: { disable: true } },
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const CurrentPageContact: Story = {
  args: { currentPath: "/contact" },
};

/**
 * A nested route keeps its parent item current — "/actualites/mon-article"
 * still marks Actualités, which is what isActiveNavItem guarantees.
 */
export const NestedRouteKeepsParentActive: Story = {
  args: { currentPath: "/actualites/mon-article" },
};

/**
 * Below 1024px the links collapse behind the menu trigger. Use the toolbar
 * viewport control to switch to Mobile, then open the menu.
 */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
};

export const Tablet: Story = {
  globals: { viewport: { value: "tablet" } },
};
