import { describe, expect, it } from "vitest";
import {
  buildCspDirectives,
  buildSecurityHeaders,
  serializeCsp,
} from "@/config/securityHeaders";

function headerMap(isDevelopment: boolean) {
  return Object.fromEntries(
    buildSecurityHeaders(isDevelopment).map((header) => [header.key, header.value]),
  );
}

const production = () => buildCspDirectives(false);
const development = () => buildCspDirectives(true);

describe("security headers", () => {
  it("sets every header the application relies on", () => {
    expect(Object.keys(headerMap(false)).sort()).toEqual([
      "Content-Security-Policy",
      "Permissions-Policy",
      "Referrer-Policy",
      "X-Content-Type-Options",
    ]);
  });

  it("stops browsers second-guessing declared content types", () => {
    expect(headerMap(false)["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("keeps paths and query strings from leaking cross-origin", () => {
    expect(headerMap(false)["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("switches off browser features the site never uses", () => {
    const policy = headerMap(false)["Permissions-Policy"];

    for (const feature of ["camera", "microphone", "geolocation"]) {
      expect(policy).toContain(`${feature}=()`);
    }
  });
});

describe("content security policy — production", () => {
  it("defaults to same-origin", () => {
    expect(production()["default-src"]).toEqual(["'self'"]);
  });

  it("blocks framing entirely, which is the clickjacking control", () => {
    expect(production()["frame-ancestors"]).toEqual(["'none'"]);
  });

  it("allows no inline or evaluated script", () => {
    const scriptSrc = production()["script-src"];

    expect(scriptSrc).toEqual(["'self'"]);
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });

  it("locks down plugins, base URI and form targets", () => {
    expect(production()["object-src"]).toEqual(["'none'"]);
    expect(production()["base-uri"]).toEqual(["'self'"]);
    expect(production()["form-action"]).toEqual(["'self'"]);
  });

  it("keeps fonts and API calls same-origin", () => {
    expect(production()["font-src"]).toEqual(["'self'"]);
    expect(production()["connect-src"]).toEqual(["'self'"]);
  });

  it("allows no inline style either, since the build emits none", () => {
    expect(production()["style-src"]).toEqual(["'self'"]);
  });

  it("upgrades insecure requests", () => {
    expect(production()).toHaveProperty("upgrade-insecure-requests");
  });

  it("uses no wildcard anywhere", () => {
    const serialized = serializeCsp(production());

    expect(serialized).not.toMatch(/\*/);
    expect(serialized).not.toMatch(/https?:(?!\/)/);
  });
});

describe("content security policy — development only relaxations", () => {
  it("allows the eval and websocket that HMR needs", () => {
    expect(development()["script-src"]).toContain("'unsafe-eval'");
    expect(development()["connect-src"]).toContain("ws:");
  });

  /**
   * `next dev` delivers CSS as inline <style> elements injected by JavaScript and emits
   * no <link rel="stylesheet"> at all, so 'self' alone leaves every page unstyled.
   * Production is the reverse and needs no such allowance.
   */
  it("allows the inline styles that next dev injects", () => {
    expect(development()["style-src"]).toContain("'unsafe-inline'");
  });

  it("does not leak those relaxations into production", () => {
    const serialized = serializeCsp(production());

    expect(serialized).not.toContain("unsafe-eval");
    expect(serialized).not.toContain("ws:");
  });

  it("keeps the framing and plugin restrictions in development too", () => {
    expect(development()["frame-ancestors"]).toEqual(["'none'"]);
    expect(development()["object-src"]).toEqual(["'none'"]);
  });
});

describe("serializeCsp", () => {
  it("renders directives as a valid policy string", () => {
    expect(
      serializeCsp({ "default-src": ["'self'"], "frame-ancestors": ["'none'"] }),
    ).toBe("default-src 'self'; frame-ancestors 'none'");
  });

  it("renders a valueless directive on its own", () => {
    expect(serializeCsp({ "upgrade-insecure-requests": [] })).toBe(
      "upgrade-insecure-requests",
    );
  });
});
