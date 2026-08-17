import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@agl/ui";

/**
 * A pass-through wrapper over `<input>`. Every native attribute reaches the element and
 * the ref is forwarded, which is what lets a form library own the value without
 * `@agl/ui` depending on one.
 *
 * There is no `invalid` prop: the error look is driven by `aria-invalid`, so the styling
 * and the accessible state cannot disagree. In real use it is wrapped by **FormField**,
 * which supplies the id and the error wiring.
 */
const meta = {
  title: "Shared/Input",
  component: Input,
  args: {
    type: "text",
    placeholder: "Votre nom complet",
    "aria-label": "Nom complet",
  },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "email", "tel"] },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "372px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Figma field width, 372px. */
export const Default: Story = {};

export const Email: Story = {
  args: { type: "email", placeholder: "votre@email.com", "aria-label": "E-mail" },
};

export const Tel: Story = {
  args: { type: "tel", placeholder: "+222 XX XX XX XX", "aria-label": "N° Tél" },
};

export const Required: Story = {
  args: { required: true },
};

/** Styling follows `aria-invalid`, so it can never show an error state it has not announced. */
export const Error: Story = {
  args: { "aria-invalid": true, defaultValue: "pas-une-adresse" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Lecture seule" },
};
