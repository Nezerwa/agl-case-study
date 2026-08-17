import { useCallback, useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";
import { DefaultLink } from "../../../types/DefaultLink";
import type { SiteHeaderProps } from "./SiteHeader.types";
import { isActiveNavItem } from "./SiteHeader.utils";

export type { NavItem, SiteLogo, SiteHeaderProps } from "./SiteHeader.types";
export { isActiveNavItem, normalizePath } from "./SiteHeader.utils";

const MENU_ID = "site-header-navigation";

export function SiteHeader({
  logo,
  navItems,
  currentPath,
  homeHref = "/",
  navLabel = "Navigation principale",
  menuButtonLabel = "Ouvrir le menu de navigation",
  linkComponent: Link = DefaultLink,
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <nav className={styles.inner} aria-label={navLabel}>
        <Link href={homeHref} className={styles.logoLink} onClick={closeMenu}>
          <img className={styles.logo} src={logo.src} alt={logo.alt} />
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuButtonLabel}
          aria-expanded={isMenuOpen}
          aria-controls={MENU_ID}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>

        <div id={MENU_ID} className={styles.menu} data-open={isMenuOpen}>
          <ul className={styles.list}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={
                    isActiveNavItem(currentPath, item.href) ? "page" : undefined
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
