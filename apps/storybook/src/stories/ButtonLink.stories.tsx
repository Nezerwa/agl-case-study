import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonLink } from "@agl/ui";
import { ICON_MAPPING, ICON_OPTIONS } from "../fixtures/icons";

/**
 * `linkComponent` is the seam that keeps `@agl/ui` free of `next/link`: the app
 * injects its own link renderer. It is a component, not data, so it has no control
 * and is hidden from the table — every story here falls back to a plain anchor.
 */
const meta = {
  title: "Shared/ButtonLink",
  component: ButtonLink,
  args: {
    children: "Lire la suite",
    href: "/actualites",
    variant: "link",
    size: "medium",
    icon: "none",
    iconPosition: "right",
  },
  argTypes: {
    children: { control: "text" },
    href: { control: "text" },
    variant: {
      control: "inline-radio",
      options: ["primary", "filter", "link"],
    },
    size: { control: "inline-radio", options: ["medium", "large"] },
    external: { control: "boolean" },
    icon: {
      control: "select",
      options: ICON_OPTIONS,
      mapping: ICON_MAPPING,
      description: "Rendered inside the link and hidden from assistive technology.",
    },
    iconPosition: { control: "inline-radio", options: ["left", "right"] },
    linkComponent: { table: { disable: true } },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkStyle: Story = {};

export const LinkWithRightIcon: Story = {
  args: { icon: "arrow", iconPosition: "right" },
};

export const ExternalLink: Story = {
  args: {
    children: "Google Maps",
    href: "https://www.google.com/maps",
    external: true,
    icon: "arrow",
    iconPosition: "right",
  },
};

export const ButtonStyledLink: Story = {
  args: {
    children: "Nous contacter",
    href: "/contact",
    variant: "primary",
    size: "large",
  },
};
