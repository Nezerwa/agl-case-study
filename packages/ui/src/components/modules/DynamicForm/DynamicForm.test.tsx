import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DynamicForm } from "./DynamicForm";
import type { FormFieldConfig } from "./DynamicForm.types";

const contactFields: FormFieldConfig[] = [
  { id: "fullName", name: "fullName", label: "Nom / Prénom (s)", type: "text", colSpan: 1 },
  { id: "phone", name: "phone", label: "N° Tél", type: "tel", colSpan: 1 },
  { id: "email", name: "email", label: "E-mail", type: "email", required: true, colSpan: 1 },
  { id: "company", name: "company", label: "Société", type: "text", colSpan: 1 },
  { id: "subject", name: "subject", label: "Objet", type: "text", required: true, colSpan: 2 },
  { id: "message", name: "message", label: "Message", type: "textarea", required: true, colSpan: 2 },
];

function renderForm(overrides: Partial<Parameters<typeof DynamicForm>[0]> = {}) {
  return render(
    <DynamicForm fields={contactFields} submitLabel="Envoyer" {...overrides} />,
  );
}

describe("DynamicForm — content comes from configuration", () => {
  it("renders the supplied title and description", () => {
    renderForm({
      title: "Envoyez-nous un message",
      description: "Pour plus d'informations n'hésitez pas à nous contacter",
    });

    expect(
      screen.getByRole("heading", { level: 2, name: "Envoyez-nous un message" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Pour plus d'informations n'hésitez pas à nous contacter"),
    ).toBeInTheDocument();
  });

  it("renders a different title and description without code changes", () => {
    renderForm({ title: "Demander un devis", description: "Parlez-nous de votre besoin" });

    expect(
      screen.getByRole("heading", { name: "Demander un devis" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Envoyez-nous/)).toBeNull();
  });

  it("omits the header entirely when neither is supplied", () => {
    renderForm();

    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("uses the submit label it is given", () => {
    renderForm({ submitLabel: "Demander un rappel" });

    expect(
      screen.getByRole("button", { name: /Demander un rappel/ }),
    ).toBeInTheDocument();
  });

  it("hardcodes no Contact fields of its own", () => {
    renderForm({
      fields: [{ id: "q", name: "q", label: "Votre question", type: "text" }],
    });

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.queryByLabelText(/Message/)).toBeNull();
    expect(screen.queryByLabelText(/Société/)).toBeNull();
  });
});

describe("DynamicForm — field types", () => {
  it("renders every supplied field", () => {
    renderForm();

    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("maps each type to the right native control", () => {
    renderForm();

    expect(screen.getByLabelText(/Nom \/ Prénom/)).toHaveAttribute("type", "text");
    expect(screen.getByLabelText(/E-mail/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/N° Tél/)).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(/Message/).tagName).toBe("TEXTAREA");
  });

  it("supports several textareas, so Message is not a special case", () => {
    renderForm({
      fields: [
        { id: "requirements", name: "requirements", label: "Besoins", type: "textarea" },
        { id: "notes", name: "notes", label: "Notes", type: "textarea" },
      ],
    });

    const boxes = screen.getAllByRole("textbox");

    expect(boxes).toHaveLength(2);
    expect(boxes.every((box) => box.tagName === "TEXTAREA")).toBe(true);
  });

  it("supports a form with no textarea at all", () => {
    renderForm({
      fields: [{ id: "email", name: "email", label: "E-mail", type: "email" }],
    });

    expect(screen.getByRole("textbox").tagName).toBe("INPUT");
  });

  it("renders fields in the order configured", () => {
    renderForm();

    const labels = screen
      .getAllByRole("textbox")
      .map((control) => control.getAttribute("id"));

    expect(labels).toEqual(contactFields.map((field) => field.id));
  });

  it("applies placeholders from configuration", () => {
    renderForm({
      fields: [
        {
          id: "email",
          name: "email",
          label: "E-mail",
          type: "email",
          placeholder: "votre@email.com",
        },
      ],
    });

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "votre@email.com",
    );
  });
});

describe("DynamicForm — column span", () => {
  it("gives full-width fields a different class from half-width ones", () => {
    const { container } = renderForm();

    const half = container.querySelector("#fullName")?.closest("div")?.className;
    const full = container.querySelector("#subject")?.closest("div")?.className;

    expect(half).not.toBe(full);
  });

  it("treats a missing colSpan as half width", () => {
    const { container } = renderForm({
      fields: [
        { id: "a", name: "a", label: "A", type: "text" },
        { id: "b", name: "b", label: "B", type: "text", colSpan: 1 },
      ],
    });

    expect(container.querySelector("#a")?.closest("div")?.className).toBe(
      container.querySelector("#b")?.closest("div")?.className,
    );
  });
});

describe("DynamicForm — submission seam", () => {
  it("is a real form element", () => {
    const { container } = renderForm();

    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("submits through the button and never reloads the page", async () => {
    const onSubmit = vi.fn();
    renderForm({
      onSubmit,
      fields: [{ id: "q", name: "q", label: "Votre question", type: "text" }],
    });

    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  /**
   * No JavaScript validation exists yet, so the browser's own constraint validation is
   * left switched on as the baseline. The next phase replaces it with Zod and will add
   * `noValidate` at that point.
   */
  it("lets the browser block submission while required fields are empty", async () => {
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits once the required fields are filled", async () => {
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    await userEvent.type(screen.getByLabelText(/E-mail/), "a@b.com");
    await userEvent.type(screen.getByLabelText(/Objet/), "Devis");
    await userEvent.type(screen.getByLabelText(/Message/), "Bonjour");
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("drives every control through getFieldProps", async () => {
    const onChange = vi.fn();
    renderForm({
      fields: [{ id: "email", name: "email", label: "E-mail", type: "email" }],
      getFieldProps: (field) => ({ name: field.name, onChange }),
    });

    await userEvent.type(screen.getByRole("textbox"), "a");

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
  });

  it("shows the submit button busy while submitting", () => {
    renderForm({ isSubmitting: true });

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});

describe("DynamicForm — errors", () => {
  it("renders an error against the field it belongs to", () => {
    renderForm({ errors: { email: "Adresse invalide" } });

    expect(screen.getByLabelText(/E-mail/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Adresse invalide")).toBeInTheDocument();
  });

  it("leaves the other fields untouched", () => {
    renderForm({ errors: { email: "Adresse invalide" } });

    expect(screen.getByLabelText(/Société/)).not.toHaveAttribute("aria-invalid");
  });

  it("keys errors by field name rather than id", () => {
    renderForm({
      fields: [{ id: "field-1", name: "email", label: "E-mail", type: "email" }],
      errors: { email: "Requis" },
    });

    expect(screen.getByText("Requis")).toBeInTheDocument();
  });
});
