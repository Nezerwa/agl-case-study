import type { ReactNode } from "react";

export interface NavLinkProps {
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  target?: string;
  rel?: string;
  "aria-current"?: "page";
}

export type NavLinkComponent = (props: NavLinkProps) => ReactNode;
