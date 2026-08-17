import type { NavLinkComponent } from "../../../types/link.types";

export interface FooterLink {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  iconSrc?: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SiteFooterProps {
  sections: FooterSection[];
  copyright: string;
  navLabel?: string;
  newWindowLabel?: string;
  linkComponent?: NavLinkComponent;
}
