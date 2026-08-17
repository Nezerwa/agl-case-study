import type { FooterSection, NavItem, SiteLogo } from "@agl/ui";

export interface SiteHeaderConfig {
  logo: SiteLogo;
  navItems: NavItem[];
}

export interface SiteFooterConfig {
  sections: FooterSection[];
  copyright: string;
}

export interface SiteConfig {
  header: SiteHeaderConfig;
  footer: SiteFooterConfig;
}
