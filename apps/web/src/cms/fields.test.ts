import { describe, expect, it } from "vitest";
import {
  readImage,
  readLink,
  readList,
  readNumber,
  readText,
  requireText,
} from "./fields";

describe("readText", () => {
  it("returns the value of a well-formed text field", () => {
    expect(readText({ title: { value: "Nos Actualités" } }, "title")).toBe(
      "Nos Actualités",
    );
  });

  it("returns undefined for a missing key", () => {
    expect(readText({}, "title")).toBeUndefined();
  });

  it("returns undefined when the field is not an object", () => {
    expect(readText({ title: "Nos Actualités" }, "title")).toBeUndefined();
  });

  it("returns undefined when value is not a string", () => {
    expect(readText({ title: { value: 42 } }, "title")).toBeUndefined();
  });

  it("returns undefined for a null field", () => {
    expect(readText({ title: null }, "title")).toBeUndefined();
  });
});

describe("requireText", () => {
  it("returns the value when present", () => {
    expect(requireText({ title: { value: "Titre" } }, "title", "—")).toBe(
      "Titre",
    );
  });

  it("falls back when the field is absent", () => {
    expect(requireText({}, "title", "—")).toBe("—");
  });

  it("falls back when the field is malformed", () => {
    expect(requireText({ title: { value: 42 } }, "title", "—")).toBe("—");
  });
});

describe("readNumber", () => {
  it("returns a numeric value", () => {
    expect(readNumber({ order: { value: 3 } }, "order")).toBe(3);
  });

  it("does not coerce numeric strings", () => {
    expect(readNumber({ order: { value: "3" } }, "order")).toBeUndefined();
  });
});

describe("readImage", () => {
  it("returns src and alt for a well-formed image field", () => {
    const field = {
      image: { value: { src: "/hero.jpg", alt: "Port autonome" } },
    };

    expect(readImage(field, "image")).toEqual({
      src: "/hero.jpg",
      alt: "Port autonome",
      width: undefined,
      height: undefined,
    });
  });

  it("carries dimensions through when present", () => {
    const field = {
      image: {
        value: { src: "/hero.jpg", alt: "Port", width: 1200, height: 630 },
      },
    };

    expect(readImage(field, "image")).toMatchObject({
      width: 1200,
      height: 630,
    });
  });

  it("rejects an image with no alt text", () => {
    expect(readImage({ image: { value: { src: "/hero.jpg" } } }, "image")).toBeUndefined();
  });

  it("rejects an image with no src", () => {
    expect(readImage({ image: { value: { alt: "Port" } } }, "image")).toBeUndefined();
  });

  it("drops non-numeric dimensions rather than passing them through", () => {
    const field = {
      image: { value: { src: "/a.jpg", alt: "a", width: "1200" } },
    };

    expect(readImage(field, "image")?.width).toBeUndefined();
  });
});

describe("readLink", () => {
  it("returns href and optional text", () => {
    const field = {
      cta: { value: { href: "/contact", text: "Nous contacter" } },
    };

    expect(readLink(field, "cta")).toMatchObject({
      href: "/contact",
      text: "Nous contacter",
    });
  });

  it("rejects a link with no href", () => {
    expect(readLink({ cta: { value: { text: "Nous contacter" } } }, "cta")).toBeUndefined();
  });

  it("keeps a recognised target", () => {
    const field = { cta: { value: { href: "/x", target: "_blank" } } };

    expect(readLink(field, "cta")?.target).toBe("_blank");
  });

  it("discards an unrecognised target", () => {
    const field = { cta: { value: { href: "/x", target: "_parent" } } };

    expect(readLink(field, "cta")?.target).toBeUndefined();
  });
});

describe("readList", () => {
  it("returns the raw items untouched", () => {
    const field = { categories: { value: [{ id: "all" }, "loose", 7] } };

    expect(readList(field, "categories")).toEqual([{ id: "all" }, "loose", 7]);
  });

  it("returns an empty array through, rather than treating it as absent", () => {
    expect(readList({ categories: { value: [] } }, "categories")).toEqual([]);
  });

  it("returns undefined for a missing field", () => {
    expect(readList({}, "categories")).toBeUndefined();
  });

  it("returns undefined when the value is not an array", () => {
    expect(readList({ categories: { value: "Tous" } }, "categories")).toBeUndefined();
    expect(readList({ categories: { value: 42 } }, "categories")).toBeUndefined();
    expect(readList({ categories: { value: null } }, "categories")).toBeUndefined();
  });

  it("returns undefined when the field is not a record", () => {
    expect(readList({ categories: "Tous" }, "categories")).toBeUndefined();
  });
});
