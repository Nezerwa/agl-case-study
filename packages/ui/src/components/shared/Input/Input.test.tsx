import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a native input", () => {
    render(<Input aria-label="Nom" />);

    expect(screen.getByRole("textbox", { name: "Nom" }).tagName).toBe("INPUT");
  });

  it("defaults to type text", () => {
    render(<Input aria-label="Nom" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("respects the type it is given", () => {
    const { rerender } = render(<Input aria-label="E-mail" type="email" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

    rerender(<Input aria-label="Téléphone" type="tel" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
  });

  it("accepts typing and reports each change", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Nom" onChange={onChange} />);

    await userEvent.type(screen.getByRole("textbox"), "Aïcha");

    expect(screen.getByRole("textbox")).toHaveValue("Aïcha");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("works as a controlled input", () => {
    render(<Input aria-label="Nom" value="Fixe" onChange={() => {}} />);

    expect(screen.getByRole("textbox")).toHaveValue("Fixe");
  });

  it("does not accept input when disabled", async () => {
    render(<Input aria-label="Nom" disabled />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "abc");

    expect(input).toBeDisabled();
    expect(input).toHaveValue("");
  });

  it("passes accessibility attributes through", () => {
    render(
      <Input
        aria-label="E-mail"
        aria-invalid
        aria-describedby="email-error"
        required
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(input).toBeRequired();
  });

  it("forwards its ref, which is how a form library takes ownership", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Nom" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("merges a caller-supplied className", () => {
    render(<Input aria-label="Nom" className="custom" />);

    expect(screen.getByRole("textbox")).toHaveClass("custom");
  });
});
