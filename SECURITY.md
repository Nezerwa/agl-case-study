# Security

What is implemented in this case study, and what a production deployment would still
need. Nothing here claims the application is secure — it describes specific defences,
the threats each addresses, and where each one stops.

---

## A. Application and browser security

Sent on every response from `next.config.ts`, built by
`apps/web/src/config/securityHeaders.ts` and asserted by
`apps/web/src/tests/security/securityHeaders.test.ts`.

### Content-Security-Policy

The production policy was derived by auditing what this application actually loads, not
copied from a template:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

Every resource is same-origin: Next's chunks under `/_next/static`, CSS Modules, the
`next/font` woff2 files self-hosted under `/_next/static/media`, and images under
`/public`. There is no CDN, analytics, embedded map or external script. The Google Maps
link in the footer is navigation, not embedding.

**Scripts are strict; styles carry one required allowance.**

| Directive | Production | Why |
| --- | --- | --- |
| `script-src` | `'self'` | No `'unsafe-inline'`, no `'unsafe-eval'`. The only inline `<script>` in the output is `__NEXT_DATA__`, which is `type="application/json"` — parsed as data, never executed |
| `style-src` | `'self' 'unsafe-inline'` | Required by Pages Router client-side navigation, below |

**Why inline styles are permitted.** The server-rendered document links its stylesheets
externally, but on a *client-side* navigation the Pages Router fetches the destination
route's CSS as text and applies it by creating an inline `<style>` element. Blocking that
leaves a client-navigated page with only the CSS the previous document already carried —
page content unstyled, chrome intact — until the visitor refreshes. This is a
compatibility requirement of how the router loads route CSS, not a defect.

The alternative is a nonce, which the router supports. **Statically generated pages cannot
use one:** the HTML is produced at build time and served identically to everyone, so a
nonce would be a build-time constant and worth nothing. Obtaining real per-request nonces
would mean abandoning static generation for server rendering plus middleware — a large
architectural change to satisfy one directive.

The allowance is confined to styles. CSS injection requires an existing injection point to
exploit; there is no `dangerouslySetInnerHTML` anywhere in the repository and all CMS
content is escaped by React. Script execution remains fully restricted.

`base-uri 'self'` stops an injected `<base>` from re-pointing every relative URL.
`form-action 'self'` stops an injected form posting elsewhere. `object-src 'none'`
removes the plugin surface entirely. All remain unchanged.

**Development relaxes two further directives.** React Refresh evaluates code and HMR opens
a websocket, so development adds `'unsafe-eval'` to `script-src` and `ws:`/`wss:` to
`connect-src`. Tests assert those two never appear in the production policy, and that
production `script-src` contains neither `'unsafe-inline'` nor `'unsafe-eval'`.

### Clickjacking

`frame-ancestors 'none'` — nothing legitimately embeds this site and it has no in-app
iframe, so `'none'` is correct rather than `'self'`. Legacy `X-Frame-Options` is **not**
sent: every browser this application targets supports `frame-ancestors`, which
supersedes it, and shipping both invites the two to drift apart.

### Other headers

| Header | Value | Why |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Stops a browser second-guessing a declared `Content-Type` — the route by which an uploaded or user-controlled file gets executed as script |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Same-origin navigation keeps the full referrer; cross-origin sends the origin only, and nothing on an HTTPS→HTTP downgrade, so page paths and query strings never leak off-site |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | A brochure site with a contact form uses none of them |
| `X-Powered-By` | removed | Version disclosure with no upside |

---

## B. CMS and dynamic component security

The CMS drives which components render, which is a code-execution surface if left open.
It is closed at three points.

**The registry is an allowlist.** `resolveCmsComponent` resolves only names present in a
fixed map, guarded with `Object.hasOwn` so `toString`, `constructor` and
`hasOwnProperty` cannot resolve through the prototype chain. Content chooses *among*
components; it cannot introduce one. An unknown name renders a development notice and
`null` in production, never a crash.

**Field types are an allowlist, not a cast.** `mapFormFieldType` accepts only
`text · email · tel · textarea`. An unrecognised type causes the field to be **dropped**,
not defaulted — a silently mistyped control invites the wrong input, and `password` or
`file` must not be reachable from content.

**Adapters narrow at runtime.** `readText`, `readList`, `readEntryText` and the rest
verify shape before returning, and every entry read is `Object.hasOwn`-guarded. `@agl/ui`
receives plain props and never sees a `CmsField`, a `CmsComponent` or a `.value`.

There is no `dangerouslySetInnerHTML` anywhere in the repository, so no CMS string is
ever interpreted as HTML.

---

## C. Contact submission security

```
DynamicForm → RHF + Zod (UX) → POST /api/contact
                                    ↓
   method → body shape → origin → rate limit → honeypot → Zod → normalise → service
```

### Client-side validation is UX, not a trust boundary

React Hook Form manages form state and validation UX. The browser-side Zod run tells a
person what is wrong before they wait for a round trip. It protects nothing: anyone can
skip React, the form, RHF and the browser entirely and POST to `/api/contact` directly.

**Server-side Zod validation is the trust boundary.** `apps/web/src/pages/api/contact.ts`
runs the same schema again with `safeParse` and uses only its parsed output.

The schema in `apps/web/src/features/contact/contact.schema.ts` is shared by both sides
so the rules cannot drift. It contains no secrets and no server-only logic, which is what
makes sharing it safe.

### The schema is generated from the field configuration

`buildContactSchema(fields)` turns the adapted CMS field list into a Zod object.
Requiredness therefore originates in content and nowhere else — flipping `required` in
the mock moves the marker, the native attribute, the browser validation and the API
validation together, because all four read the same flag.

**The API builds its schema from its own copy of the configuration**, read through
`getLayout("contact")` and the same adapter the page renders from. It is deliberately not
taken from the request: a caller who could supply the field list would declare everything
optional and walk straight past validation. A test posts a `fields` array claiming a
required field is optional and asserts the rejection stands.

The CMS chooses only *whether* a supported field is required. Bounds and formats come
from the field's **type**, so there is no path from content to executable validation
logic:

| Type | Bounds | Format |
| --- | --- | --- |
| `text` | ≤150 | — |
| `email` | ≤254, lowercased | RFC-shaped |
| `tel` | ≤30 | digits and `+ ( ) . -` |
| `textarea` | 10–5000 | — |

A required field rejects an empty value; an optional one accepts empty or absent but
still enforces its type's bounds and format once filled — an optional e-mail may be
blank, never malformed. Length is measured after trimming, so whitespace cannot satisfy
a required field.

It establishes bounds and shape only. It does not strip characters: names legitimately
contain apostrophes, hyphens and accents — O'Connor, Jean-Pierre, Aïcha — and messages
contain ordinary punctuation. Removing "suspicious" characters would corrupt real
submissions while stopping no real attack. Escaping belongs at the point of output.

The current Contact configuration marks every visible field required except **Objet**.

### Request size

`bodyParser.sizeLimit` is `16kb` on the route. The largest legitimate submission is
roughly 6 KB of text, so a multi-megabyte POST is rejected before it reaches Zod, and the
per-field `.max()` values are the second line rather than the only one.

### Honeypot

A `website` field, positioned off-screen, `tabIndex={-1}`, inside an `aria-hidden`
wrapper. No person meets it — a test asserts only six controls appear in the
accessibility tree. If it arrives non-empty the request is rejected with the same
`INVALID_REQUEST` shape as any other malformed body, so an automated client learns
nothing about why it failed.

One integration detail worth recording: the client-side Zod resolver **strips unknown
keys**, so the honeypot did not survive validation and never reached the server. It is
now re-attached explicitly before the POST. Without that, a bot driving a real browser
would have filled the trap invisibly. A test covers it.

### Rate limiting

Five submissions per ten minutes per client, returning `429` with `Retry-After`.

**This limiter is in-memory and single-instance only.** Each Node process holds its own
counters, so on a horizontally scaled or serverless deployment an attacker gets
`limit × instances` requests and counters vanish on every cold start. It is honest for a
single-instance demonstration and nothing more. The `RateLimiter` interface exists so the
production swap touches one file.

### Client identification

`x-forwarded-for` (first entry) → `x-real-ip` → socket address. **Trusting the forwarded
header assumes a platform proxy that overwrites it.** On a direct-to-Node deployment a
client can set it freely and rotate past a per-IP limit, so that deployment must ignore
the header and use the socket address.

### Origin

A cross-site form post carries the attacker's `Origin`, so comparing it to the host
rejects that case cheaply. A **missing** Origin is allowed: non-browser clients
legitimately omit it, browsers always send it on cross-origin POSTs, and anything able to
omit the header can also forge it. This is one layer and the others do not depend on it.

### CSRF — deliberately not a token

A synchronizer token would be security theatre here.

CSRF exploits *ambient authority*: the browser attaches a cookie or session automatically,
so a forged cross-site request acts **as the victim**. This endpoint is public and
unauthenticated. There is no session, no cookie, no account and no privileged state
change. A forged request achieves exactly what a direct `curl` achieves — sending an
anonymous message — so a token adds ceremony without removing a capability.

What actually limits abuse here is volume and content control: origin checking, rate
limiting, the honeypot, and server-side validation.

**This conclusion is contingent.** The moment the endpoint reads a session, writes
user-scoped data, or performs anything privileged, CSRF protection becomes necessary and
this decision must be revisited.

### Responses

Fixed, safe shapes — never a stack, an internal hostname, a credential or a raw Zod tree:

```
200  { success: true,  referenceId }
400  { success: false, error: "VALIDATION_ERROR", fieldErrors }   one message per field
400  { success: false, error: "INVALID_REQUEST" }                 malformed or honeypot
403  { success: false, error: "FORBIDDEN_ORIGIN" }
405  { success: false, error: "METHOD_NOT_ALLOWED" }              with Allow: POST
429  { success: false, error: "RATE_LIMITED" }                    with Retry-After
500  { success: false, error: "SUBMISSION_FAILED" }
```

A thrown downstream error may carry provider hostnames or credentials, so it is caught
and replaced. Tests assert that a rejection carrying `sk_live_…` and an internal hostname
produces a response containing neither.

### Mock submission service

`contactSubmission.service.ts` is the one deliberately mocked step. Everything upstream is
real. It returns a reference id and never logs the submission body — names, addresses and
message contents are personal data, and a console line is the easiest way for it to end up
somewhere it was never meant to be. Development logging is limited to lengths and
presence flags.

Introducing a real CRM or transactional-email provider is a change to that file alone.

---

## D. Production notes

Not implemented here, and required before this handles real traffic.

- **Distributed rate limiting.** Redis, Upstash or a managed WAF rule, replacing the
  in-memory limiter.
- **A real submission provider**, with retries, a dead-letter path, and secrets from a
  managed store rather than the environment.
- **Deployment-aware client identification** — decide whether `x-forwarded-for` is
  trustworthy for the chosen platform.
- **Monitoring** on 4xx/5xx rates and rate-limit hits; a spike is the signal that the
  current thresholds are wrong.
- **CAPTCHA** only if the honeypot and rate limit prove insufficient in practice. It has a
  real accessibility and conversion cost and should not be added pre-emptively.
- **Dependency advisories.** `npm audit` currently reports three high-severity findings,
  all transitive through Next's own `postcss` and `sharp`, and all resolved only by a Next
  major upgrade. None come from the dependencies added for this feature.
- **Attack surface.** `/api/contact` is the only API route the application exposes; the
  `create-next-app` scaffold route was removed.
