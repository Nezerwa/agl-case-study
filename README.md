# Africa Global Logistics — Frontend Case Study

Implementation of the Africa Global Logistics frontend case study: a Turborepo monorepo
containing a Next.js application built on the Pages Router, a framework-independent
component library, CMS-shaped content contracts, and a Storybook workspace that documents
the same components the application renders.

Two pages are delivered — **Actualités** and **Contact** — both composed entirely from
CMS-shaped data rather than hand-assembled in the page files. The Contact page includes a
configuration-driven form with client and server validation, a real `POST /api/contact`
endpoint, anti-abuse controls, and site-wide security headers. 480 automated tests cover
the component behaviour, the CMS mapping layer, the API pipeline and the security
configuration.

---

## 1. Requirements coverage

| Requirement                                    | Implementation                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functional web application based on the design | `/actualites` and `/contact`, both statically generated                                                                                           |
| Component-based implementation                 | 13 components in `packages/ui`, consumed by the app and by Storybook                                                                              |
| Responsive user interface                      | Mobile-first CSS Modules, two shared breakpoints, no per-device components                                                                        |
| Contact form as complete as possible           | React Hook Form + Zod, real POST to `/api/contact`, server-side revalidation, UI success and error states                                         |
| Appropriate security considerations            | CSP and related headers, server-side validation, origin check, rate limiting, honeypot, body-size limit                                           |
| Reusable and dynamic components                | Registry-driven composition; one `Hero` renders three different sections from configuration, and `DynamicForm` renders configuration-defined forms using supported, allowlisted field types |
| Next.js v14.2 or later                         | **15.5.23**                                                                                                                                       |
| React v18.2 or later                           | **18.3.1**                                                                                                                                        |
| Pages Router                                   | `apps/web/src/pages` — no App Router anywhere                                                                                                     |

The requirement asks for Next.js 14.2 _or later_; the repository runs 15.5.23 on the
Pages Router.

---

## 2. Getting started

**Prerequisites:** Node.js 18.18+ and npm 11+ (the repo pins `npm@11.6.2` via
`packageManager`).

```bash
git clone https://github.com/Nezerwa/agl-case-study.git
cd agl-case-study
npm install
npm run dev
```

The application runs at **http://localhost:3000**:

| Route          | Description                          |
| -------------- | ------------------------------------ |
| `/`            | Landing page                         |
| `/actualites`  | News listing with category filtering |
| `/contact`     | Contact page and form                |
| `/api/contact` | Form submission endpoint (POST only) |

**No environment variables are required.** The only environment value read anywhere is
`NODE_ENV`, which the toolchain sets. There is no `.env` file and none is needed.

---

## 3. Storybook

Storybook documents the reusable component library in isolation, independently of
page-level CMS composition.

```bash
npm run storybook          # http://localhost:6006
npm run build-storybook    # static build → apps/storybook/storybook-static
```

Both the application and Storybook consume the **same** package. There is no duplicate
component implementation:

```
                    packages/ui
                   /           \
                  ▼             ▼
             apps/web      apps/storybook
```

11 story files, 59 stories:

| Shared primitives                                     | Modules                                             |
| ----------------------------------------------------- | --------------------------------------------------- |
| Badge, Button, ButtonLink, FormField, Input, Textarea | DynamicForm, Hero, NewsCard, SiteFooter, SiteHeader |

---

## 4. Available commands

Run from the repository root; Turborepo fans each task out to the workspaces that define it.

| Command                   | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Start the Next.js development server          |
| `npm run storybook`       | Start Storybook on port 6006                  |
| `npm run check-types`     | TypeScript across all four workspaces         |
| `npm run lint`            | ESLint across the workspaces that define it   |
| `npm run test`            | Vitest suites in `apps/web` and `packages/ui` |
| `npm run build`           | Next.js production build                      |
| `npm run build-storybook` | Static Storybook build                        |

---

## 5. Project structure

```
apps/
├── web/          Next.js application, CMS pipeline, contact feature, security
└── storybook/    Component documentation

packages/
├── ui/           @agl/ui — framework-independent component library
└── cms-types/    @agl/cms-types — CMS content contracts (types only)
```

Dependency direction, as declared in the workspace manifests:

```
        packages/cms-types            packages/ui
                 │                    ╱         ╲
                 ▼                   ▼           ▼
             apps/web ──────────────╯       apps/storybook
```

`apps/web` depends on both packages. `apps/storybook` depends only on `packages/ui`.
Neither package depends on an application, and `packages/ui` declares no runtime
dependencies at all — React and React DOM are peer dependencies.

---

## 6. The `@agl/ui` boundary

The component library is deliberately independent of the application's framework and
libraries. Verified by inspection of `packages/ui/src`:

| Import            | Occurrences |
| ----------------- | ----------- |
| `next/*`          | 0           |
| `react-hook-form` | 0           |
| `zod`             | 0           |
| `@agl/cms-types`  | 0           |

This is what allows Storybook and the unit tests to render every component without a
Next.js server, and it means the library could be reused by another application.

**Navigation.** Components that render links accept a `linkComponent` prop. The
application injects `next/link`; when nothing is injected the component falls back to a
plain anchor, which is what Storybook and the tests use.

```
apps/web ──── injects next/link ────► @agl/ui
                                        │
                          no injection ─┴─► native <a>
```

External links use the native anchor **by choice**, not by limitation: leaving the origin
is a real navigation rather than a client-side route transition, and `target` and `rel`
are anchor concerns.

**Forms.** React Hook Form lives in the application layer. `DynamicForm` exposes a single
`getFieldProps(field)` seam that returns native control props, and `Input` and `Textarea`
forward refs. RHF's `register()` returns exactly that shape, so it drives the form without
the library importing it.

---

## 7. CMS-driven architecture

No CMS endpoint was supplied with the assignment, so CMS-shaped mock data stands at the
integration boundary. The contracts in `@agl/cms-types` model a Sitecore-style Layout
Service payload (`{ sitecore: { context, route: { placeholders } } }`) — the application
does **not** connect to Sitecore or any other CMS.

```
apps/web/src/cms/mocks/*.mock.ts          CMS-shaped layout data
                │
                ▼
        actions/layout.action.ts          the seam a real Layout Service replaces
                │
                ▼
   getStaticProps  →  page  →  CmsPlaceholder("main")
                                    │
                                    ▼
                       registry/componentRegistry.ts        allowlist lookup
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
                  adapters/*.ts            UnknownComponent
                CMS fields → props        (unregistered name)
                        │
                        ▼
        Hero (@agl/ui)  ·  NewsListing (apps/web)  ·  ContactForm (apps/web)
```

Each layer has one job:

- **Mocks** hold CMS-shaped content, including field wrappers such as `{ value: ... }`.
- **Actions** resolve a route name to layout data. Only this file knows the data is mocked.
- **Adapters** narrow CMS fields at runtime and return clean component props. `@agl/ui`
  never receives a `CmsField` or a raw `.value`.
- **The registry** maps allowlisted component names to implementations. Lookup is guarded
  with `Object.hasOwn`, so inherited object properties cannot resolve.
- **The renderer** walks a placeholder and renders each entry, falling back to a
  development-only notice for an unregistered name and `null` in production.

Two registry entries point at application-level components rather than library ones —
`NewsListing` and `ContactForm` own React state, which is how a controlled component can
be CMS-driven without pushing state into the library.

---

## 8. Page composition

Page files contain no presentation markup. Both render a placeholder and let the layout
data decide what appears:

```
/actualites                          /contact
CmsPlaceholder("main")               CmsPlaceholder("main")
├── Hero                             ├── Hero
├── NewsListing                      └── ContactForm
│   ├── CategoryFilter
│   └── NewsGrid → NewsCard × 6
└── Hero
```

`SiteHeader` and `SiteFooter` are page-independent and come from `SiteLayout` in `_app`.

**One `Hero` implementation renders three different sections.** The Actualités header, the
newsletter band and the Contact header differ only in CMS field values — `title`,
`description`, `badgeLabel`, `variant`, `align`, `headingLevel` and `size`. No
page-specific Hero variant exists. Configuration determines presentation within a
constrained component API, rather than a new component per section.

---

## 9. Component library

**Shared primitives** — Badge, Button, ButtonLink, FormField, Input, Textarea

**Modules** — CategoryFilter, DynamicForm, Hero, NewsCard, NewsGrid, SiteFooter, SiteHeader

The components are presentation-focused and framework-independent: they receive data as
props, own no application state, and reach outside themselves only through explicit seams
such as `linkComponent` and `getFieldProps`. Styling is CSS Modules, scoped per component.

See Storybook for variants, controls and isolated documentation rather than a prop table here.

---

## 10. Dynamic contact form

`DynamicForm` is not bound to the Contact page's current six fields. It renders whatever
field list it receives.

```
CMS form configuration              contact.mock.ts → formFields[]
          │
          ▼
     form.adapter.ts                type allowlist, colSpan, required
          │
          ▼
   ContactForm (apps/web) ──────────── react-hook-form + zodResolver
          │                            buildContactSchema(fields)
          ▼
   DynamicForm (@agl/ui)              layout, grid, submit
          │
          ▼
      FormField                       label, required marker, error wiring
        ╱      ╲
    Input    Textarea                 native controls, refs forwarded
```

Configuration-driven per field: `name`, `label`, `type`, order, `required`, `colSpan`,
`placeholder`, `hint`, and `rows` for textareas.

Supported types are allowlisted to `text`, `email`, `tel` and `textarea`. The adapter
maps an incoming type against that list and **drops** any field whose type is
unrecognised, rather than defaulting it — content cannot instantiate arbitrary components
or reach an unintended control such as a file input. Because the renderer selects a
primitive from `field.type`, a form with several textareas, or none, needs different
configuration rather than different code.

### Requiredness

A single CMS flag drives every layer:

```
CMS field.required          (must be a real boolean; the string "yes" does not qualify)
        │
        ├──► required marker and native required attribute
        ├──► client schema  (React Hook Form resolver)
        └──► server schema  (/api/contact)
```

Both schemas are generated by the same `buildContactSchema(fields)` function, so
requiredness cannot drift between browser and API. The server builds its copy from the
CMS layout it reads itself, never from the request body.

In the current Contact configuration, **Objet** is optional; Nom / Prénom(s), N° Tél,
E-mail, Société and Message are required.

---

## 11. Form state, validation and submission

**React Hook Form** manages form state: field registration through `getFieldProps`,
touched and dirty tracking, the submit lifecycle including the in-flight state that
disables the button, and the error objects the UI presents. It is a form-state library,
not a security control.

**Zod** defines the rules. The schema is generated from the field configuration: the CMS
decides only whether a field is required, while bounds and formats come from the field's
_type_. The schema does two distinct things.

_Validation_ — requiredness, minimum and maximum lengths, and field-specific formats such
as e-mail shape and a permitted character set for `tel`. It applies no arbitrary character
sanitisation, so names containing apostrophes, hyphens and accented characters are
accepted unchanged.

_Normalisation_, applied as part of parsing — every value is trimmed, e-mail is
lowercased, and an optional field left empty becomes absent rather than an empty string.
Length is measured after trimming, so whitespace alone cannot satisfy a required field.

```
Browser
   │  React Hook Form  →  Zod (client)          user experience only
   ▼
POST /api/contact
════════════════════════════════════ SERVER TRUST BOUNDARY ════════════
   │
   ├─ body-size limit          16 kb, applied before parsing
   ├─ method check             non-POST → 405 with Allow: POST
   ├─ body shape check         non-object → 400
   ├─ origin check             cross-origin → 403
   ├─ rate limit               over quota → 429 with Retry-After
   ├─ honeypot                 filled → 400, same shape as any rejection
   ├─ Zod (server)             invalid → 400 with one message per field
   ├─ normalisation            trim, lowercase e-mail, empty → absent
   ▼
Submission service  →  200 { success: true, referenceId }
```

Client-side validation exists so a person sees a problem before waiting for a round trip.
It is not trusted: anyone can skip the browser entirely and post directly to the endpoint.
The server runs the same schema again, and that run is the authoritative boundary.

---

## 12. What happens to a contact submission

1. The user fills the form; React Hook Form tracks state.
2. Client-side Zod validation runs and blocks submission on invalid input.
3. The browser sends a real `POST` to `/api/contact` with a JSON body.
4. The endpoint runs the security and validation pipeline above.
5. Validated, normalised data reaches `contactSubmission.service.ts`.
6. The service returns a reference id, which the UI shows in an accessible status message.

**The downstream boundary is mocked.** No database, CRM, email provider or ticketing
system was supplied with the assignment, so the submission service simulates a short async
call and returns a generated reference. **Valid submissions are not persisted and no email
is sent.** The service never logs submission contents.

That module is the single integration point: connecting a real CRM, transactional email
provider, ticketing system or database is a change to that file, with no redesign of the
form, the API pipeline or the validation layer.

---

## 13. Security

Detailed threat modelling, decisions and limitations are in **[SECURITY.md](./SECURITY.md)**.
Summary of what is implemented:

**Browser and application** — Content-Security-Policy, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` disabling
unused device features. Clickjacking is handled by CSP `frame-ancestors 'none'`. The
production policy contains no `unsafe-inline` and no `unsafe-eval`; development relaxes
two directives for hot reload, and a test asserts those relaxations never appear in the
production policy.

**CMS boundary** — an allowlisted component registry with own-property lookups, runtime
narrowing of every CMS field, and an allowlisted form-field-type list that drops
unrecognised types.

**Contact endpoint** — independent server-side Zod validation, a 16 kb request body limit,
origin validation, an off-screen honeypot field, rate limiting, and fixed safe error
shapes that never return a stack trace, an internal hostname or the raw validation tree.

The trust boundary is explicit: **browser validation is user experience; server validation
is authoritative.**

A CSRF token was deliberately not introduced: the endpoint is public and unauthenticated,
and does not rely on privileged cookie-authenticated state. The detailed threat-model
reasoning, and the conditions under which this decision should be revisited, are documented
in [SECURITY.md](./SECURITY.md).

**Rate limiting is in-memory** and single-instance. It demonstrates the anti-abuse
boundary for this case study; a horizontally scaled or serverless deployment would need a
shared store, since per-process counters both multiply the effective limit and reset on
cold start. The limiter sits behind an interface so that swap touches one file.

---

## 14. Responsive design

Mobile-first, with two breakpoints shared across the codebase: **768px** and **1024px**.
Every component is written small-screen-first and adds layout at those widths; there are
no separate mobile or tablet component implementations.

The supplied design was a desktop composition, so desktop measurements were taken from it
and the intermediate and small-screen behaviour was derived from the same design system —
consistent spacing scale, the shared content boundary, and content requirements such as
readable line length and comfortable touch targets. Derived values are not presented as
design-confirmed.

---

## 15. Accessibility

Built into the components rather than added afterwards:

- Semantic landmarks — `header`, `nav`, `main`, `footer`, `article`, `section` — and a
  skip link to the main content.
- Keyboard-operable navigation and controls, with visible `:focus-visible` states.
- `aria-current="page"` on the active navigation item; `aria-pressed` on the category
  filter controls, so selection is not communicated by colour alone.
- Form labels associated with their controls, required state exposed both visually and to
  assistive technology, `aria-invalid` on failed fields, and errors linked by
  `aria-describedby`.
- Submission progress announced through `aria-busy`, and the result through a live status
  region.
- Contextual accessible names where repeated link text would be ambiguous — each
  "Lire la suite" announces its article title.
- Decorative icons hidden with `aria-hidden`, and external links carrying a hidden
  new-window hint.

No formal WCAG audit was carried out, so no conformance level is claimed.

---

## 16. Testing and quality

**480 tests across 35 files** — 205 in `packages/ui`, 275 in `apps/web`.

| Area                    | Covered                                                         |
| ----------------------- | --------------------------------------------------------------- |
| Component behaviour     | Rendering, variants, interaction, prop contracts                |
| Accessibility semantics | Roles, labels, `aria-*` state, keyboard paths                   |
| CMS adapters            | Field mapping, malformed content, prototype-chain safety        |
| Runtime field narrowing | Every reader in `cms/fields.ts`                                 |
| Component registry      | Allowlist behaviour, unknown-name fallback                      |
| Dynamic form            | Config-driven rendering, column spans, submission seam          |
| Schema generation       | Requiredness from configuration, type rules, normalisation      |
| Form controller         | RHF integration, states, double-submission, honeypot            |
| API pipeline            | Method, origin, rate limit, honeypot, validation, error leakage |
| Security headers        | CSP directives and development/production separation            |
| Page composition        | Rendered order, heading hierarchy                               |

```bash
npm run check-types
npm run lint
npm run test
npm run build
npm run build-storybook
```

TypeScript runs in strict mode with `noUnusedLocals`, `noUnusedParameters` and
`noFallthroughCasesInSwitch`. Coverage tooling is not configured, so no coverage
percentage is claimed.

---

## 17. Technical decisions

| Decision                         | Reason                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Turborepo monorepo               | Keeps the app, component library, CMS contracts and Storybook in one repository with explicit dependency direction |
| Framework-independent `@agl/ui`  | Renderable in Storybook and tests without a Next.js server, and reusable by another application                    |
| Injected `linkComponent`         | Lets the app supply `next/link` without the library importing Next.js                                              |
| CMS adapters                     | Isolate the CMS payload shape from component props, so a schema change stops at the adapter                        |
| Allowlisted component registry   | Content selects among known components; it cannot introduce one                                                    |
| Generated Zod schema             | One `buildContactSchema` used by browser and server, so validation rules cannot drift                              |
| React Hook Form in the app layer | Form state management without coupling the UI library to it                                                        |
| CSS Modules                      | Component-scoped styling with no runtime styling dependency                                                        |
| Storybook                        | Isolated component documentation, and a check that components render outside the app                               |
| Mock submission service          | Completes the real browser-to-server flow without inventing downstream infrastructure that was not supplied        |

---

## 18. Assumptions and trade-offs

**CMS.** No CMS endpoint was supplied. CMS-shaped mock data represents the integration
seam, and the layout action is the single place a real Layout Service call replaces.

**Contact processing.** No CRM, email provider or database was supplied. The form, API
route, validation and security pipeline are real; downstream processing is mocked.

**Rate limiting.** In-memory and single-instance, as described above.

**Responsive design.** Dedicated tablet and mobile compositions were not supplied, so
behaviour at those widths was derived from the design system and content requirements.
Values derived this way are documented as derived rather than confirmed.

**Content.** Article titles, dates, categories and images come from the supplied design.
Article body copy is placeholder text.

---

## 19. Production evolution

These are replacement seams the architecture already provides, not integrations that exist
today:

| Case-study implementation                               | Production evolution                             |
| ------------------------------------------------------- | ------------------------------------------------ |
| CMS-shaped mocks behind `layout.action.ts`              | Real CMS / Layout Service call                   |
| Mock submission service                                 | CRM, email, ticketing or persistence integration |
| In-memory rate limiter behind a `RateLimiter` interface | Shared or distributed store                      |
| Placeholder article copy                                | CMS-authored content                             |

---

## 20. Documentation

| Where                        | What                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| `README.md`                  | Setup, architecture, and the reasoning behind the major decisions |
| [SECURITY.md](./SECURITY.md) | Security model, threat decisions, and limitations                 |
| Storybook                    | Isolated component documentation, variants and controls           |
