export interface RequestIdentity {
  forwardedFor?: string | string[];
  realIp?: string | string[];
  remoteAddress?: string;
}

/**
 * `x-forwarded-for` is trusted only because a platform proxy is assumed to overwrite it.
 * Behind no proxy, a client can set it to anything and rotate past a per-IP limit — so
 * on a direct-to-Node deployment this header must be ignored and `remoteAddress` used
 * instead. Documented rather than silently assumed.
 */
export function getClientIdentifier(identity: RequestIdentity): string {
  const forwarded = first(identity.forwardedFor);
  if (forwarded) {
    const client = forwarded.split(",")[0]?.trim();
    if (client) return client;
  }

  const realIp = first(identity.realIp);
  if (realIp) return realIp;

  return identity.remoteAddress ?? "unknown";
}

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * A cross-site form post carries the attacker's `Origin`, so comparing it to the host
 * rejects that case cheaply.
 *
 * A **missing** Origin is allowed. Non-browser clients — curl, server-to-server calls,
 * monitoring — legitimately omit it, and browsers already send it on every cross-origin
 * POST, which is the case this check exists for. Treating absence as hostile would break
 * legitimate clients while stopping nothing, since anything that can omit the header can
 * also forge it. This is one layer; the honeypot, rate limit and server-side validation
 * do not depend on it.
 */
export function isAllowedOrigin(
  origin: string | undefined,
  host: string | undefined,
): boolean {
  if (!origin) return true;
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
