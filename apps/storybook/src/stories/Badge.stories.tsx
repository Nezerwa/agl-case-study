import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@agl/ui";
import { ICON_MAPPING, ICON_OPTIONS } from "../fixtures/icons";

const meta = {
  title: "Shared/Badge",
  component: Badge,
  args: {
    children: "Événements",
    variant: "solid",
    size: "small",
    icon: "none",
  },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: ["solid", "translucent"] },
    size: { control: "inline-radio", options: ["small", "medium"] },
    icon: {
      control: "select",
      options: ICON_OPTIONS,
      mapping: ICON_MAPPING,
      description: "Rendered before the label and hidden from assistive technology.",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SolidSmall: Story = {
  args: { size: "medium" },
};

export const SolidSmallPresse: Story = {
  args: { children: "Presse" },
};

/**
 * The translucent variant is a 10% white wash with no colour of its own. It only
 * reads on a dark, image, or gradient surface — on a light background it is
 * invisible, which is why this story supplies the brand gradient behind it.
 */
export const TranslucentMediumWithIcon: Story = {
  args: {
    children: "Actualités",
    variant: "translucent",
    size: "medium",
    icon: "tag",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background:
            "linear-gradient(90deg, #ff38b3 0%, #cc2d90 22.1%, #bf2a87 41.3%, #b3277e 65.4%, #99226c 94.2%)",
          padding: "3rem 2rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const TranslucentOnLightIsInvisible: Story = {
  args: {
    children: "Actualités",
    variant: "translucent",
    size: "medium",
  },
};
