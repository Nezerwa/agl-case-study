import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@agl/ui";
import { ICON_MAPPING, ICON_OPTIONS } from "../fixtures/icons";

const meta = {
  title: "Shared/Button",
  component: Button,
  args: {
    children: "Envoyer",
    variant: "primary",
    size: "medium",
    icon: "none",
    iconPosition: "left",
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "inline-radio",
      options: ["primary", "filter", "link"],
    },
    size: { control: "inline-radio", options: ["medium", "large"] },
    isSelected: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: {
      control: "select",
      options: ICON_OPTIONS,
      mapping: ICON_MAPPING,
      description: "Rendered inside the button and hidden from assistive technology.",
    },
    iconPosition: { control: "inline-radio", options: ["left", "right"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryMedium: Story = {};

export const PrimaryLarge: Story = {
  args: { size: "large" },
};

export const PrimaryWithIcon: Story = {
  args: { size: "large", icon: "send", iconPosition: "left" },
};

export const FilterUnselected: Story = {
  args: { variant: "filter", children: "Événements", isSelected: false },
};

export const FilterSelected: Story = {
  args: { variant: "filter", children: "Tous", isSelected: true },
};

export const LinkVariant: Story = {
  args: { variant: "link", children: "Lire la suite" },
};

export const Disabled: Story = {
  args: { size: "large", disabled: true },
};

export const Loading: Story = {
  args: { size: "large", isLoading: true, children: "Envoi en cours" },
};
