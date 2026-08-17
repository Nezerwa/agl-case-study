import { describe, expect, it } from "vitest";
import type { CmsComponent } from "@agl/cms-types";
import {
  registeredComponentNames,
  resolveCmsComponent,
} from "./componentRegistry";

describe("resolveCmsComponent", () => {
  it("resolves a registered component", () => {
    expect(resolveCmsComponent("Hero")).toBeDefined();
  });

  it("exposes both a component and an adapter for a registered entry", () => {
    const definition = resolveCmsComponent("Hero");

    expect(definition?.component).toBeTypeOf("function");
    expect(definition?.adapt).toBeTypeOf("function");
  });

  it("runs the adapter bound to the registered component", () => {
    const definition = resolveCmsComponent("Hero");
    const component: CmsComponent = {
      uid: "u1",
      componentName: "Hero",
      fields: { title: { value: "Nos Actualités" } },
    };

    expect(definition?.adapt(component)).toMatchObject({
      title: "Nos Actualités",
    });
  });

  it("returns undefined for an unregistered component", () => {
    expect(resolveCmsComponent("NewsletterBanner")).toBeUndefined();
  });

  it("returns undefined rather than throwing on an empty name", () => {
    expect(resolveCmsComponent("")).toBeUndefined();
  });

  it("does not resolve inherited object properties", () => {
    expect(resolveCmsComponent("toString")).toBeUndefined();
    expect(resolveCmsComponent("constructor")).toBeUndefined();
    expect(resolveCmsComponent("hasOwnProperty")).toBeUndefined();
  });
});

describe("registeredComponentNames", () => {
  it("reports the registry contents", () => {
    expect(registeredComponentNames()).toEqual([
      "Hero",
      "NewsListing",
      "ContactForm",
    ]);
  });
});

describe("resolveCmsComponent — NewsListing", () => {
  it("resolves the registered component", () => {
    expect(resolveCmsComponent("NewsListing")).toBeDefined();
  });

  it("runs the adapter bound to the registered component", () => {
    const definition = resolveCmsComponent("NewsListing");
    const component: CmsComponent = {
      uid: "u2",
      componentName: "NewsListing",
      fields: {
        defaultCategory: { value: "all" },
        categories: { value: [{ id: "all", label: "Tous", value: "all" }] },
        articles: {
          value: [
            {
              id: "salon",
              category: "events",
              categoryLabel: "Événements",
              title: "Salon",
              href: "/actualites/salon",
              image: { src: "/a.svg", alt: "" },
            },
          ],
        },
      },
    };

    expect(definition?.adapt(component)).toMatchObject({
      categories: [{ id: "all", label: "Tous", value: "all" }],
      initialCategory: "all",
      articles: [{ id: "salon", category: "events" }],
    });
  });
});
