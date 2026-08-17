import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@agl/ui";

/**
 * The `<textarea>` counterpart to Input, with the same pass-through and ref-forwarding
 * contract.
 *
 * `resize: vertical` is an implementation decision, not a Figma value: the design fixes
 * the height, but a long message is exactly where a reader benefits from growing the
 * box, and `none` would remove an affordance the browser gives for free.
 */
const meta = {
  title: "Shared/Textarea",
  component: Textarea,
  args: {
    placeholder: "Votre message...",
    "aria-label": "Message",
  },
  argTypes: {
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 2, max: 20 } },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "768px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma full-span width, 768px. */
export const Default: Story = {};

export const Error: Story = {
  args: { "aria-invalid": true, defaultValue: "Trop court" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Lecture seule" },
};
