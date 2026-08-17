import Link from "next/link";
import { useRouter } from "next/router";
import { SiteFooter, SiteHeader } from "@agl/ui";
import { fetchSiteConfig } from "@/cms/actions/siteConfig.action";
import styles from "./SiteLayout.module.css";
import type { SiteLayoutProps } from "./SiteLayout.types";

export function SiteLayout({ children }: SiteLayoutProps) {
  const router = useRouter();
  const { header, footer } = fetchSiteConfig();

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Aller au contenu principal
      </a>

      <SiteHeader
        logo={header.logo}
        navItems={header.navItems}
        currentPath={router.pathname}
        linkComponent={Link}
      />

      <main id="main-content">{children}</main>

      <SiteFooter
        sections={footer.sections}
        copyright={footer.copyright}
        linkComponent={Link}
      />
    </>
  );
}
