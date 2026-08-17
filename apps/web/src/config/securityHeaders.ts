/**
 * Built from an audit of what this application actually loads, not from a template.
 *
 * Everything is same-origin: Next's chunks under `/_next/static`, CSS Modules, the
 * `next/font` woff2 files self-hosted under `/_next/static/media`, and images and icons
 * under `/public`. There is no CDN, no analytics, no embedded map, no external script.
 * The Google Maps link in the footer is navigation, not embedding. So `default-src
 * 'self'` covers the application and each directive below narrows further.
 */

export interface CspDirectives {
  [directive: string]: string[];
}

export function buildCspDirectives(isDevelopment: boolean): CspDirectives {
  return {
    "default-src": ["'self'"],

    // Every executable script is an external file under /_next/static. The only inline
    // <script> Next emits is __NEXT_DATA__, which is type="application/json" and is
    // parsed as data, never executed — so no 'unsafe-inline' is needed in production.
    // Development additionally evaluates code for React Refresh and HMR.
    "script-src": isDevelopment
      ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
      : ["'self'"],

    // 'unsafe-inline' is required by the Pages Router, in both environments.
    //
    // The server-rendered document links its stylesheets externally, but on a *client-side*
    // navigation Next fetches the destination route's CSS as text and applies it by creating
    // an inline <style> element. Without this allowance the browser refuses that element, so
    // the destination renders with only the CSS the previous document already carried — page
    // content unstyled, chrome intact — until a manual refresh. A nonce is the alternative,
    // but a nonce must vary per request and these pages are statically generated, so it would
    // be a build-time constant and worth nothing.
    //
    // `next dev` goes further and delivers all CSS this way, emitting no stylesheet links.
    //
    // This applies to styles only. `script-src` above stays free of both 'unsafe-inline' and
    // 'unsafe-eval' in production, which is where the meaningful protection sits.
    "style-src": ["'self'", "'unsafe-inline'"],

    // data: covers the inlined SVG placeholders Next may emit for small assets.
    "img-src": ["'self'", "data:"],

    "font-src": ["'self'"],

    // /api/contact is same-origin. Development also needs the HMR websocket.
    "connect-src": isDevelopment ? ["'self'", "ws:", "wss:"] : ["'self'"],

    // No <object>, <embed> or <applet> anywhere in the application.
    "object-src": ["'none'"],

    // Stops an injected <base> tag from re-pointing every relative URL at another host.
    "base-uri": ["'self'"],

    // The contact form posts to its own API and nothing else submits anywhere.
    "form-action": ["'self'"],

    // The clickjacking control. Nothing legitimately embeds this site, so 'none' is
    // correct rather than 'self' — there is no in-app iframe either.
    "frame-ancestors": ["'none'"],

    ...(isDevelopment ? {} : { "upgrade-insecure-requests": [] }),
  };
}

export function serializeCsp(directives: CspDirectives): string {
  return Object.entries(directives)
    .map(([directive, values]) =>
      values.length > 0 ? `${directive} ${values.join(" ")}` : directive,
    )
    .join("; ");
}

export interface HttpHeader {
  key: string;
  value: string;
}

export function buildSecurityHeaders(isDevelopment: boolean): HttpHeader[] {
  return [
    {
      key: "Content-Security-Policy",
      value: serializeCsp(buildCspDirectives(isDevelopment)),
    },
    // Stops a browser from second-guessing a declared Content-Type, which is how a
    // user-supplied file gets treated as a script.
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Same-origin navigations keep the full referrer, which analytics and debugging
    // rely on; cross-origin gets the origin only over HTTPS and nothing on a downgrade,
    // so page paths and query strings never leak off-site.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // A brochure site with a contact form needs none of these.
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
  ];
}
