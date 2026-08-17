import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";
import { Input } from "../Input/Input";

describe("FormField — label association", () => {
  it("associates the label with the control", () => {
    render(
      <FormField id="email" label="E-mail">
        {(control) => <Input type="email" {...control} />}
      </FormField>,
    );

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("does not rely on the placeholder as a label", () => {
    render(
      <FormField id="email" label="E-mail">
        {(control) => (
          <Input type="email" placeholder="votre@email.com" {...control} />
        )}
      </FormField>,
    );

    expect(screen.getByRole("textbox", { name: "E-mail" })).toHaveAttribute(
      "placeholder",
      "votre@email.com",
    );
  });
});

describe("FormField — required", () => {
  it("marks the control required and announces it in the label", () => {
    render(
      <FormField id="objet" label="Objet" required>
        {(control) => <Input {...control} />}
      </FormField>,
    );

    expect(screen.getByRole("textbox", { name: /Objet/ })).toBeRequired();
    expect(screen.getByRole("textbox", { name: /obligatoire/ })).toBeInTheDocument();
  });

  it("hides the decorative asterisk from assistive technology", () => {
    const { container } = render(
      <FormField id="objet" label="Objet" required>
        {(control) => <Input {...control} />}
      </FormField>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("*");
  });

  it("leaves an optional field unmarked", () => {
    render(
      <FormField id="societe" label="Société">
        {(control) => <Input {...control} />}
      </FormField>,
    );

    expect(screen.getByRole("textbox")).not.toBeRequired();
    expect(screen.queryByText(/obligatoire/)).toBeNull();
  });
});

describe("FormField — error", () => {
  it("renders the error message", () => {
    render(
      <FormField id="email" label="E-mail" error="Adresse invalide">
        {(control) => <Input type="email" {...control} />}
      </FormField>,
    );

    expect(screen.getByText("Adresse invalide")).toBeInTheDocument();
  });

  it("points the control at the message and flags it invalid", () => {
    render(
      <FormField id="email" label="E-mail" error="Adresse invalide">
        {(control) => <Input type="email" {...control} />}
      </FormField>,
    );

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(document.getElementById("email-error")).toHaveTextContent(
      "Adresse invalide",
    );
  });

  it("stays valid and undescribed when there is no error", () => {
    render(
      <FormField id="email" label="E-mail">
        {(control) => <Input type="email" {...control} />}
      </FormField>,
    );

    const input = screen.getByRole("textbox");

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("describes the control by hint and error together", () => {
    render(
      <FormField id="tel" label="N° Tél" hint="Format international" error="Requis">
        {(control) => <Input type="tel" {...control} />}
      </FormField>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "tel-hint tel-error",
    );
  });
});
