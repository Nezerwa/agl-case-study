export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitDecision;
  reset(): void;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}

/**
 * A sliding window kept in process memory.
 *
 * **This is single-instance only.** Each Node process holds its own counters, so on a
 * horizontally scaled or serverless deployment an attacker gets `limit × instances`
 * requests, and counters vanish on every cold start. It is honest for a single-instance
 * demonstration and nothing more.
 *
 * Production wants a shared store — Redis, Upstash, or a managed WAF rule. The
 * `RateLimiter` interface exists so that swap touches this file only; the API route
 * depends on the interface, not on the Map.
 */
export function createInMemoryRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
}: RateLimiterOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  function prune(now: number) {
    for (const [key, timestamps] of hits) {
      const live = timestamps.filter((at) => now - at < windowMs);
      if (live.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, live);
      }
    }
  }

  return {
    check(key, now = Date.now()) {
      const timestamps = (hits.get(key) ?? []).filter(
        (at) => now - at < windowMs,
      );

      if (timestamps.length >= limit) {
        const oldest = timestamps[0];
        hits.set(key, timestamps);

        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((windowMs - (now - oldest)) / 1000),
          ),
        };
      }

      timestamps.push(now);
      hits.set(key, timestamps);

      // An unbounded Map keyed by client address is itself a memory-exhaustion target.
      if (hits.size > maxKeys) {
        prune(now);
      }

      return {
        allowed: true,
        remaining: limit - timestamps.length,
        retryAfterSeconds: 0,
      };
    },

    reset() {
      hits.clear();
    },
  };
}
