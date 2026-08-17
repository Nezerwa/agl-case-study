import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicForm } from "@agl/ui";
import type { FormFieldConfig } from "@agl/ui";

const contactFields: FormFieldConfig[] = [
  {
    id: "fullName",
    name: "fullName",
    label: "Nom / Prénom (s)",
    type: "text",
    placeholder: "Votre nom complet",
    colSpan: 1,
  },
  {
    id: "phone",
    name: "phone",
    label: "N° Tél",
    type: "tel",
    placeholder: "+222 XX XX XX XX",
    colSpan: 1,
  },
  {
    id: "email",
    name: "email",
    label: "E-mail",
    type: "email",
    placeholder: "votre@email.com",
    required: true,
    colSpan: 1,
  },
  {
    id: "company",
    name: "company",
    label: "Société",
    type: "text",
    placeholder: "Nom de votre société",
    colSpan: 1,
  },
  {
    id: "subject",
    name: "subject",
    label: "Objet",
    type: "text",
    placeholder: "Objet de votre message",
    required: true,
    colSpan: 2,
  },
  {
    id: "message",
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Votre message...",
    required: true,
    colSpan: 2,
  },
];

/**
 * A form rendered entirely from configuration. Nothing about the Contact page is baked
 * in: title, description, submit label, field list, field order and column spans all
 * arrive as data, so another page reuses this component by authoring different CMS
 * fields rather than by writing another form.
 *
 * **Values stay outside.** The only seam is `getFieldProps(field)`, which returns native
 * control props. React Hook Form's `register()` returns exactly `{ name, onChange,
 * onBlur, ref }`, so integrating it later is `getFieldProps={(f) => register(f.name)}`
 * — with no form library inside `@agl/ui`. The **Interactive** story drives the same
 * seam with plain `useState`.
 *
 * Validation is not implemented yet. The browser's own constraint validation is left on
 * as the baseline, so required fields already block submission.
 */
const meta = {
  title: "Modules/DynamicForm",
  component: DynamicForm,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Envoyez-nous un message",
    description: "Pour plus d'informations n'hésitez pas à nous contacter",
    submitLabel: "Envoyer",
    fields: contactFields,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    submitLabel: { control: "text" },
    fields: { control: "object" },
    errors: { control: "object" },
    isSubmitting: { control: "boolean" },
    headingLevel: { control: "inline-radio", options: ["h2", "h3"] },
    onSubmit: { table: { disable: true } },
    getFieldProps: { table: { disable: true } },
  },
} satisfies Meta<typeof DynamicForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The exact Contact page configuration — six fields, two columns at desktop. */
export const ContactConfiguration: Story = {};

/**
 * Three fields and a different title, from configuration alone. Proof the component is
 * not Contact-specific.
 */
export const ShortForm: Story = {
  args: {
    title: "Demander un devis",
    description: "Parlez-nous de votre besoin",
    submitLabel: "Demander un devis",
    fields: [
      { id: "name", name: "name", label: "Nom", type: "text", required: true, colSpan: 1 },
      { id: "email", name: "email", label: "E-mail", type: "email", required: true, colSpan: 1 },
      { id: "need", name: "need", label: "Votre besoin", type: "textarea", required: true, colSpan: 2 },
    ],
  },
};

/**
 * Two textareas and no single-line field. "Message" is a field type, never a special
 * property, so this needed no change to DynamicForm.
 */
export const MultipleTextareas: Story = {
  args: {
    title: "Décrivez votre projet",
    submitLabel: "Envoyer le brief",
    fields: [
      { id: "requirements", name: "requirements", label: "Besoins", type: "textarea", required: true, colSpan: 2 },
      { id: "constraints", name: "constraints", label: "Contraintes", type: "textarea", colSpan: 2 },
      { id: "notes", name: "notes", label: "Notes complémentaires", type: "textarea", colSpan: 2 },
    ],
  },
};

/** Errors arrive from the consuming application, keyed by field name. */
export const WithErrors: Story = {
  args: {
    errors: {
      email: "Veuillez saisir une adresse e-mail valide",
      message: "Le message doit contenir au moins 20 caractères",
    },
  },
};

export const Submitting: Story = {
  args: { isSubmitting: true },
};

/** A form with no header, for a page that supplies its own heading. */
export const WithoutHeader: Story = {
  args: { title: undefined, description: undefined },
};

/**
 * The same `getFieldProps` seam React Hook Form will use, driven here by `useState`.
 * Type into the fields and submit — the captured values appear below the form.
 */
export const Interactive: Story = {
  render: function InteractiveForm(args) {
    const [values, setValues] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);

    return (
      <>
        <DynamicForm
          {...args}
          getFieldProps={(field) => ({
            name: field.name,
            value: values[field.name] ?? "",
            onChange: (event) =>
              setValues((current) => ({
                ...current,
                [field.name]: event.target.value,
              })),
          })}
          onSubmit={() => setSubmitted(values)}
        />
        {submitted ? (
          <pre
            style={{
              maxWidth: "1024px",
              margin: "0 auto 3rem",
              padding: "1rem",
              background: "#f3f4f6",
              borderRadius: "8px",
              fontSize: "0.875rem",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(submitted, null, 2)}
          </pre>
        ) : null}
      </>
    );
  },
};

export const Tablet: Story = {
  globals: { viewport: { value: "tablet" } },
};

/** One column below 768px, with the same fields and the same control padding. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile" } },
};
