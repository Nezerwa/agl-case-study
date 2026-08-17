import type { NavLinkComponent } from "../../../types/link.types";

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteLogo {
  src: string;
  alt: string;
}

export interface SiteHeaderProps {
  logo: SiteLogo;
  navItems: NavItem[];
  currentPath: string;
  homeHref?: string;
  navLabel?: string;
  menuButtonLabel?: string;
  linkComponent?: NavLinkComponent;
}
