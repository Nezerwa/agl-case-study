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

  it("returns undefined for an unregistered component", () => {
    expect(resolveCmsComponent("NewsletterBanner")).toBeUndefined();
  });

  it("returns undefined rather than throwing on an empty name", () => {
    expect(resolveCmsComponent("")).toBeUndefined();
  });

  it("does not resolve inherited object properties", () => {
    expect(resolveCmsComponent("toString")).toBeUndefined();
    expect(resolveCmsComponent("constructor")).toBeUndefined();
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
});

describe("registeredComponentNames", () => {
  it("lists Hero", () => {
    expect(registeredComponentNames()).toContain("Hero");
  });
});
