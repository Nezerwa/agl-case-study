import styles from "./ButtonLink.module.css";
import { DefaultLink } from "../../../types/DefaultLink";
import {
  buttonClassName,
  buttonIconClassName,
} from "../Button/Button.utils";
import type { ButtonLinkProps } from "./ButtonLink.types";

export type { ButtonLinkProps } from "./ButtonLink.types";

export function ButtonLink({
  href,
  external = false,
  variant = "link",
  size = "medium",
  icon,
  iconPosition = "right",
  isSelected = false,
  className,
  newWindowLabel = "(nouvelle fenêtre)",
  linkComponent = DefaultLink,
  children,
}: ButtonLinkProps) {
  const Link = external ? DefaultLink : linkComponent;

  const renderedIcon = icon ? (
    <span className={buttonIconClassName()} aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <Link
      href={href}
      className={buttonClassName({
        variant,
        size,
        isSelected,
        className: [styles.anchor, className].filter(Boolean).join(" "),
      })}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {iconPosition === "left" ? renderedIcon : null}
      <span>{children}</span>
      {iconPosition === "right" ? renderedIcon : null}
      {external ? <span className={styles.srOnly}>{newWindowLabel}</span> : null}
    </Link>
  );
}
