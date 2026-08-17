import { describe, expect, it } from "vitest";
import { createInMemoryRateLimiter } from "./rateLimit";

describe("createInMemoryRateLimiter", () => {
  it("allows requests up to the limit", () => {
    const limiter = createInMemoryRateLimiter({ limit: 3, windowMs: 1000 });

    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("a", 1).allowed).toBe(true);
    expect(limiter.check("a", 2).allowed).toBe(true);
  });

  it("blocks the request past the limit", () => {
    const limiter = createInMemoryRateLimiter({ limit: 2, windowMs: 1000 });

    limiter.check("a", 0);
    limiter.check("a", 1);

    expect(limiter.check("a", 2).allowed).toBe(false);
  });

  it("reports how long to wait", () => {
    const limiter = createInMemoryRateLimiter({ limit: 1, windowMs: 10_000 });

    limiter.check("a", 0);
    const decision = limiter.check("a", 3000);

    expect(decision.allowed).toBe(false);
    expect(decision.retryAfterSeconds).toBe(7);
  });

  it("counts down the remaining allowance", () => {
    const limiter = createInMemoryRateLimiter({ limit: 3, windowMs: 1000 });

    expect(limiter.check("a", 0).remaining).toBe(2);
    expect(limiter.check("a", 1).remaining).toBe(1);
    expect(limiter.check("a", 2).remaining).toBe(0);
  });

  it("frees the allowance as the window slides", () => {
    const limiter = createInMemoryRateLimiter({ limit: 2, windowMs: 1000 });

    limiter.check("a", 0);
    limiter.check("a", 100);

    expect(limiter.check("a", 200).allowed).toBe(false);
    expect(limiter.check("a", 1050).allowed).toBe(true);
  });

  it("keeps callers independent, so one client cannot lock out another", () => {
    const limiter = createInMemoryRateLimiter({ limit: 1, windowMs: 1000 });

    limiter.check("a", 0);

    expect(limiter.check("a", 1).allowed).toBe(false);
    expect(limiter.check("b", 1).allowed).toBe(true);
  });

  it("does not grow without bound when keys keep changing", () => {
    const limiter = createInMemoryRateLimiter({
      limit: 5,
      windowMs: 100,
      maxKeys: 10,
    });

    for (let i = 0; i < 50; i += 1) {
      limiter.check(`client-${i}`, 1000 + i);
    }

    expect(limiter.check("client-0", 5000).allowed).toBe(true);
  });

  it("can be reset", () => {
    const limiter = createInMemoryRateLimiter({ limit: 1, windowMs: 10_000 });

    limiter.check("a", 0);
    expect(limiter.check("a", 1).allowed).toBe(false);

    limiter.reset();

    expect(limiter.check("a", 2).allowed).toBe(true);
  });
});
