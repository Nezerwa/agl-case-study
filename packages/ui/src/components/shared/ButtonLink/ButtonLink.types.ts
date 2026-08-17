import type { ButtonOwnProps } from "../Button/Button.types";
import type { NavLinkComponent } from "../../../types/link.types";

export interface ButtonLinkProps extends ButtonOwnProps {
  href: string;
  external?: boolean;
  className?: string;
  newWindowLabel?: string;
  linkComponent?: NavLinkComponent;
}
