import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnknownComponent } from "./UnknownComponent";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("UnknownComponent", () => {
  it("names the missing component outside production", () => {
    render(<UnknownComponent componentName="NewsletterBanner" />);

    expect(screen.getByRole("note")).toHaveTextContent("NewsletterBanner");
  });

  it("renders nothing in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const { container } = render(
      <UnknownComponent componentName="NewsletterBanner" />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
