import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "./CategoryFilter";
import type { CategoryOption } from "./CategoryFilter.types";

const categories: CategoryOption[] = [
  { id: "all", label: "Tous", value: "all" },
  { id: "events", label: "Événements", value: "events" },
  { id: "press", label: "Presse", value: "press" },
];

function renderFilter(overrides: Partial<Parameters<typeof CategoryFilter>[0]> = {}) {
  const onChange = vi.fn();
  const result = render(
    <CategoryFilter
      categories={categories}
      selectedValue="all"
      onChange={onChange}
      {...overrides}
    />,
  );

  return { ...result, onChange };
}

describe("CategoryFilter — rendering from props", () => {
  it("renders one control per supplied category", () => {
    renderFilter();

    expect(screen.getAllByRole("button")).toHaveLength(categories.length);
  });

  it("renders the labels it was given", () => {
    renderFilter();

    expect(screen.getByRole("button", { name: "Tous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Événements" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Presse" })).toBeInTheDocument();
  });

  it("hardcodes no categories of its own", () => {
    renderFilter({
      categories: [
        { id: "a", label: "Alpha", value: "a" },
        { id: "b", label: "Beta", value: "b" },
      ],
      selectedValue: "a",
    });

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.queryByText("Tous")).toBeNull();
    expect(screen.queryByText("Événements")).toBeNull();
    expect(screen.queryByText("Presse")).toBeNull();
  });

  it("renders nothing when there are no categories", () => {
    const { container } = renderFilter({ categories: [] });

    expect(container).toBeEmptyDOMElement();
  });
});

describe("CategoryFilter — selection state", () => {
  it("marks only the selected category as pressed", () => {
    renderFilter({ selectedValue: "events" });

    expect(screen.getByRole("button", { name: "Événements" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Presse" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("follows a different selectedValue", () => {
    const { rerender, onChange } = renderFilter({ selectedValue: "all" });

    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    rerender(
      <CategoryFilter
        categories={categories}
        selectedValue="press"
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("button", { name: "Presse" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("presses nothing when the selected value matches no category", () => {
    renderFilter({ selectedValue: "unknown-category" });

    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("communicates selection without relying on colour alone", () => {
    renderFilter({ selectedValue: "events" });

    expect(
      screen.getByRole("button", { name: "Événements", pressed: true }),
    ).toBeInTheDocument();
  });
});

describe("CategoryFilter — notifying the parent", () => {
  it("calls onChange when a category is clicked", async () => {
    const { onChange } = renderFilter();

    await userEvent.click(screen.getByRole("button", { name: "Presse" }));

    expect(onChange).toHaveBeenCalledOnce();
  });

  it("passes the stable value rather than the label or the id", async () => {
    const { onChange } = renderFilter({
      categories: [{ id: "cms-uid-42", label: "Événements", value: "events" }],
      selectedValue: "all",
    });

    await userEvent.click(screen.getByRole("button", { name: "Événements" }));

    expect(onChange).toHaveBeenCalledWith("events");
  });

  it("still notifies when the already-selected category is clicked", async () => {
    const { onChange } = renderFilter({ selectedValue: "all" });

    await userEvent.click(screen.getByRole("button", { name: "Tous" }));

    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("keeps its own state out of it — the pressed control does not move on click", async () => {
    const { onChange } = renderFilter({ selectedValue: "all" });

    await userEvent.click(screen.getByRole("button", { name: "Presse" }));

    expect(onChange).toHaveBeenCalledWith("press");
    expect(screen.getByRole("button", { name: "Tous" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("CategoryFilter — accessibility", () => {
  it("exposes a named group", () => {
    renderFilter();

    expect(
      screen.getByRole("group", { name: "Filtrer les actualités par catégorie" }),
    ).toBeInTheDocument();
  });

  it("accepts a caller-supplied group name", () => {
    renderFilter({ ariaLabel: "Filtrer par thème" });

    expect(screen.getByRole("group", { name: "Filtrer par thème" })).toBeInTheDocument();
  });

  it("renders native buttons that never submit a form", () => {
    renderFilter();

    for (const button of screen.getAllByRole("button")) {
      expect(button.tagName).toBe("BUTTON");
      expect(button).toHaveAttribute("type", "button");
    }
  });

  it("reaches every category with the keyboard", async () => {
    const { onChange } = renderFilter();

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("events");
  });
});

describe("CategoryFilter — styling seam", () => {
  it("merges a caller-supplied className onto the outer element", () => {
    const { container } = renderFilter({ className: "custom" });

    expect(container.firstElementChild).toHaveClass("custom");
  });
});
