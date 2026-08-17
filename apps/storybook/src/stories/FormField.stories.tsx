import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField, Input, Textarea } from "@agl/ui";

/**
 * Label, control, and optional hint and error — the structure every field shares.
 *
 * `children` is a **render prop** rather than a plain node. FormField computes the `id`,
 * the `aria-describedby` and the `aria-invalid` flag from the label and message it was
 * given, then hands them back for the control to apply:
 *
 * ```tsx
 * <FormField id="email" label="E-mail" required error={error}>
 *   {(control) => <Input type="email" {...control} />}
 * </FormField>
 * ```
 *
 * Passing the control as a plain child would leave that wiring to the caller, where it
 * can silently drift out of sync. This way it cannot.
 */
const meta = {
  title: "Shared/FormField",
  component: FormField,
  args: {
    id: "email",
    label: "E-mail",
    children: (control) => (
      <Input type="email" placeholder="votre@email.com" {...control} />
    ),
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    required: { control: "boolean" },
    hint: { control: "text" },
    error: { control: "text" },
    children: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "372px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputField: Story = {};

/**
 * The asterisk is `aria-hidden` and a visually hidden "obligatoire" carries the meaning,
 * so the requirement is not communicated by a glyph alone.
 */
export const RequiredField: Story = {
  args: { required: true },
};

/**
 * The message is linked by `aria-describedby` and carries an icon as well as colour, so
 * the error is never signalled by colour alone.
 */
export const ErrorField: Story = {
  args: { required: true, error: "Veuillez saisir une adresse e-mail valide" },
};

export const WithHint: Story = {
  args: { hint: "Nous ne partagerons jamais votre adresse" },
};

/** Hint and error together produce a single `aria-describedby` listing both. */
export const HintAndError: Story = {
  args: {
    hint: "Nous ne partagerons jamais votre adresse",
    error: "Veuillez saisir une adresse e-mail valide",
  },
};

export const TextareaField: Story = {
  args: {
    id: "message",
    label: "Message",
    required: true,
    children: (control) => <Textarea placeholder="Votre message..." {...control} />,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "768px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
