import styles from "./SiteFooter.module.css";
import { DefaultLink } from "../../../types/DefaultLink";
import type { NavLinkComponent } from "../../../types/link.types";
import type { FooterLink, SiteFooterProps } from "./SiteFooter.types";

export type {
  FooterLink,
  FooterSection,
  SiteFooterProps,
} from "./SiteFooter.types";

interface FooterItemProps {
  link: FooterLink;
  linkComponent: NavLinkComponent;
  newWindowLabel: string;
}

function FooterItem({
  link,
  linkComponent: Link,
  newWindowLabel,
}: FooterItemProps) {
  const content = (
    <>
      {link.iconSrc ? (
        <img className={styles.icon} src={link.iconSrc} alt="" />
      ) : null}
      <span className={styles.label}>{link.label}</span>
    </>
  );

  if (!link.href) {
    return <span className={styles.text}>{content}</span>;
  }

  if (link.external) {
    return (
      <DefaultLink
        href={link.href}
        className={`${styles.link} ${styles.external}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
        <span className={styles.srOnly}>{newWindowLabel}</span>
      </DefaultLink>
    );
  }

  return (
    <Link href={link.href} className={styles.link}>
      {content}
    </Link>
  );
}

export function SiteFooter({
  sections,
  copyright,
  navLabel = "Navigation du pied de page",
  newWindowLabel = "(nouvelle fenêtre)",
  linkComponent = DefaultLink,
}: SiteFooterProps) {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.inner}>
        {sections.length > 0 ? (
          <nav className={styles.columns} aria-label={navLabel}>
            {sections.map((section) => (
              <div key={section.id} className={styles.column}>
                <h2 className={styles.title}>{section.title}</h2>
                <ul
                  className={styles.list}
                  data-with-icons={section.links.some((link) => link.iconSrc)}
                >
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <FooterItem
                        link={link}
                        linkComponent={linkComponent}
                        newWindowLabel={newWindowLabel}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}

        <div className={styles.legal}>
          <p className={styles.copyright}>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
