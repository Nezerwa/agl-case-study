import { describe, expect, it } from "vitest";
import { getClientIdentifier, isAllowedOrigin } from "./requestGuards";

describe("getClientIdentifier", () => {
  it("prefers the first entry of x-forwarded-for", () => {
    expect(
      getClientIdentifier({ forwardedFor: "203.0.113.7, 70.41.3.18, 150.172.238.178" }),
    ).toBe("203.0.113.7");
  });

  it("handles a repeated header arriving as an array", () => {
    expect(getClientIdentifier({ forwardedFor: ["203.0.113.7", "70.41.3.18"] })).toBe(
      "203.0.113.7",
    );
  });

  it("falls back to x-real-ip", () => {
    expect(getClientIdentifier({ realIp: "203.0.113.9" })).toBe("203.0.113.9");
  });

  it("falls back to the socket address", () => {
    expect(getClientIdentifier({ remoteAddress: "127.0.0.1" })).toBe("127.0.0.1");
  });

  it("never returns an empty key, which would bucket every caller together", () => {
    expect(getClientIdentifier({})).toBe("unknown");
    expect(getClientIdentifier({ forwardedFor: "  " })).toBe("unknown");
  });
});

describe("isAllowedOrigin", () => {
  it("allows a same-origin submission", () => {
    expect(isAllowedOrigin("https://agl.example.com", "agl.example.com")).toBe(true);
    expect(isAllowedOrigin("http://localhost:3000", "localhost:3000")).toBe(true);
  });

  it("rejects a cross-site submission", () => {
    expect(isAllowedOrigin("https://evil.example.com", "agl.example.com")).toBe(false);
  });

  it("rejects a look-alike host", () => {
    expect(isAllowedOrigin("https://agl.example.com.evil.net", "agl.example.com")).toBe(
      false,
    );
  });

  it("distinguishes ports, since another app on the box is another origin", () => {
    expect(isAllowedOrigin("http://localhost:4000", "localhost:3000")).toBe(false);
  });

  it("allows a missing Origin, which non-browser clients omit", () => {
    expect(isAllowedOrigin(undefined, "agl.example.com")).toBe(true);
  });

  it("rejects a malformed Origin rather than trying to interpret it", () => {
    expect(isAllowedOrigin("not-a-url", "agl.example.com")).toBe(false);
    expect(isAllowedOrigin("null", "agl.example.com")).toBe(false);
  });

  it("rejects when the host is unknown", () => {
    expect(isAllowedOrigin("https://agl.example.com", undefined)).toBe(false);
  });
});
