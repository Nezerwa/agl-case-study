import { describe, expect, it } from "vitest";
import { getLayout, isRouteFound } from "./layout.action";

describe("getLayout", () => {
  it("returns a populated route for a known route name", async () => {
    const layout = await getLayout("actualites");

    expect(layout.sitecore.route?.name).toBe("actualites");
  });

  it("returns placeholders for a known route", async () => {
    const layout = await getLayout("actualites");

    expect(layout.sitecore.route?.placeholders.main.length).toBeGreaterThan(0);
  });

  it("returns a null route for an unknown route name", async () => {
    const layout = await getLayout("does-not-exist");

    expect(layout.sitecore.route).toBeNull();
  });

  it("still returns a valid context for an unknown route", async () => {
    const layout = await getLayout("does-not-exist");

    expect(layout.sitecore.context.site.name).toBe("agl-group");
  });

  it("does not resolve inherited object properties as routes", async () => {
    const layout = await getLayout("constructor");

    expect(layout.sitecore.route).toBeNull();
  });
});

describe("isRouteFound", () => {
  it("is true when the layout carries a route", async () => {
    expect(isRouteFound(await getLayout("actualites"))).toBe(true);
  });

  it("is false when the route is null", async () => {
    expect(isRouteFound(await getLayout("does-not-exist"))).toBe(false);
  });
});
