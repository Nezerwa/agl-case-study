import type { ComponentProps, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "@agl/ui";
import { ICON_MAPPING, ICON_OPTIONS } from "../fixtures/icons";

type HeroStoryArgs = ComponentProps<typeof Hero> & {
  badgeLabel: string;
  badgeIcon: ReactNode;
};

/**
 * Hero is presentational: a badge, a heading and a paragraph. It renders no button
 * or link, because no Hero in the Figma model carries one.
 *
 * `badge` is an object (`{ label, icon? }`) and cannot be typed into a control, so
 * it is composed here from two story-level controls instead: **badgeLabel**, which
 * is free text, and **badgeIcon**, a dropdown. Clearing the label removes the badge.
 */
const meta = {
  title: "Modules/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
  render: ({ badgeLabel, badgeIcon, ...heroProps }) => (
    <Hero
      {...heroProps}
      badge={badgeLabel ? { label: badgeLabel, icon: badgeIcon } : undefined}
    />
  ),
  args: {
    title: "Nos Actualités",
    description: "Découvrez les dernières nouvelles et événements",
    variant: "brand",
    align: "left",
    headingLevel: "h1",
    badgeLabel: "",
    badgeIcon: "none",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["brand", "surface"] },
    align: { control: "inline-radio", options: ["left", "center"] },
    headingLevel: { control: "inline-radio", options: ["h1", "h2"] },
    size: {
      control: "inline-radio",
      options: ["default", "large"],
      description:
        "Vertical rhythm only. The type scale rides on headingLevel, not on this.",
    },
    badgeLabel: {
      control: "text",
      description: "Badge text. Leave empty to render no badge at all.",
      table: { category: "Badge" },
    },
    badgeIcon: {
      control: "select",
      options: ICON_OPTIONS,
      mapping: ICON_MAPPING,
      description: "Icon rendered before the badge label.",
      table: { category: "Badge" },
    },
    badge: { table: { disable: true } },
  },
} satisfies Meta<HeroStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 22:1028 — Actualités page header. The only Hero with a badge. */
export const WithBadge: Story = {
  args: {
    badgeLabel: "Actualités",
    badgeIcon: "tag",
  },
};

/** The same Hero without the badge, so the two can be compared side by side. */
export const WithoutBadge: Story = {};

/** Figma 22:1506 — Contact page header: brand, left, h1, no badge. */
export const BrandLeft: Story = {
  args: {
    title: "Contactez-nous",
    description:
      "Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets logistiques",
  },
};

/**
 * Figma 22:1181 — the band between the news grid and the footer on Actualités, and
 * the clearest proof the component is CMS-configurable: the same component as
 * **WithBadge**, same gradient, different CMS fields. No badge is authored, so none
 * renders — nothing had to be switched off.
 *
 * `size: "large"` is the only structural difference from the page header.
 */
export const BrandCenterH2: Story = {
  args: {
    title: "Restez informé",
    description:
      "Inscrivez-vous à notre newsletter pour recevoir les dernières actualités",
    align: "center",
    headingLevel: "h2",
    size: "large",
  },
};

/** Figma 22:1567 — form section header: surface, centred, h2. */
export const SurfaceCenterH2: Story = {
  args: {
    title: "Envoyez-nous un message",
    description: "Pour plus d'informations n'hésitez pas à nous contacter",
    variant: "surface",
    align: "center",
    headingLevel: "h2",
  },
};

export const WithoutDescription: Story = {
  args: { description: undefined },
};
