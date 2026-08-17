/**
 * Reduces a path to a bare comparable form so two paths that point at the same
 * page compare equal.
 *
 * Strips the hash and query string, then removes a single trailing slash. An
 * empty result becomes "/" so the home route always has a value to compare.
 *
 *   "/actualites?page=2"  -> "/actualites"
 *   "/actualites#top"     -> "/actualites"
 *   "/actualites/"        -> "/actualites"
 *   ""                    -> "/"
 *   "/"                   -> "/"   (the single slash is kept)
 */
export function normalizePath(path: string): string {
  const withoutHash = path.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];

  if (withoutQuery.length === 0) {
    return "/";
  }

  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }

  return withoutQuery;
}

/**
 * Decides whether a navigation item points at the page currently being viewed.
 *
 * Matches on whole path segments rather than substrings, so "/actualites-archive"
 * never activates "/actualites". A nested page does activate its parent, so
 * "/actualites/mon-article" keeps the Actualités item marked as current.
 *
 * Absolute and protocol-relative URLs are never active, since they leave the site.
 * "/" only matches "/" exactly, otherwise it would match every page.
 */
export function isActiveNavItem(currentPath: string, href: string): boolean {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) {
    return false;
  }

  const current = normalizePath(currentPath);
  const target = normalizePath(href);

  if (target === "/") {
    return current === "/";
  }

  if (current === target) {
    return true;
  }

  return current.startsWith(`${target}/`);
}
