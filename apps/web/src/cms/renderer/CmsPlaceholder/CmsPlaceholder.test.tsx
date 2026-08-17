import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CmsPlaceholders } from "@agl/cms-types";
import { CmsPlaceholder } from "./CmsPlaceholder";

const placeholders: CmsPlaceholders = {
  main: [
    {
      uid: "u1",
      componentName: "Premier",
      fields: { title: { value: "Premier" } },
    },
    {
      uid: "u2",
      componentName: "Second",
      fields: { title: { value: "Second" } },
    },
  ],
  aside: [],
};

describe("CmsPlaceholder", () => {
  it("renders every component in the named placeholder", () => {
    render(<CmsPlaceholder name="main" placeholders={placeholders} />);

    expect(screen.getAllByRole("note")).toHaveLength(2);
  });

  it("preserves the order given by the CMS", () => {
    render(<CmsPlaceholder name="main" placeholders={placeholders} />);

    const rendered = screen.getAllByRole("note");
    expect(rendered[0]).toHaveTextContent("Premier");
    expect(rendered[1]).toHaveTextContent("Second");
  });

  it("renders nothing for an empty placeholder", () => {
    const { container } = render(
      <CmsPlaceholder name="aside" placeholders={placeholders} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a placeholder that does not exist", () => {
    const { container } = render(
      <CmsPlaceholder name="footer" placeholders={placeholders} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
