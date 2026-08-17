import type { NavLinkProps } from "./link.types";

/**
 * A plain anchor, reached in two distinct situations.
 *
 * It is the default whenever no `linkComponent` is injected. This package must never
 * import `next/link`, so Storybook, the unit tests and any non-Next consumer need
 * something that renders without one — and `linkComponent` is optional, so without a
 * default React receives `undefined` and refuses to render the component at all.
 *
 * It is also chosen **over** an injected component for external links: client-side
 * routing to another origin is wrong, and `target` and `rel` are anchor concerns rather
 * than router concerns.
 */
export function DefaultLink({ href, children, ...rest }: NavLinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
