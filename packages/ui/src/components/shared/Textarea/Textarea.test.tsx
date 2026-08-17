import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a native textarea", () => {
    render(<Textarea aria-label="Message" />);

    expect(screen.getByRole("textbox", { name: "Message" }).tagName).toBe(
      "TEXTAREA",
    );
  });

  it("accepts typing and reports changes", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="Message" onChange={onChange} />);

    await userEvent.type(screen.getByRole("textbox"), "Bonjour");

    expect(screen.getByRole("textbox")).toHaveValue("Bonjour");
    expect(onChange).toHaveBeenCalled();
  });

  it("works as a controlled textarea", () => {
    render(<Textarea aria-label="Message" value="Fixe" onChange={() => {}} />);

    expect(screen.getByRole("textbox")).toHaveValue("Fixe");
  });

  it("accepts a caller-supplied row count", () => {
    render(<Textarea aria-label="Message" rows={12} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "12");
  });

  it("passes accessibility attributes through", () => {
    render(
      <Textarea
        aria-label="Message"
        aria-invalid
        aria-describedby="message-error"
        required
      />,
    );

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "message-error");
    expect(textarea).toBeRequired();
  });

  it("forwards its ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Message" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
