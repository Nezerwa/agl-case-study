import styles from "./Button.module.css";
import type { ButtonSize, ButtonVariant } from "./Button.types";

interface ButtonClassNameOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  isSelected?: boolean;
  className?: string;
}

/**
 * Builds the class list shared by Button and ButtonLink so the two stay visually
 * identical without duplicating CSS.
 *
 * The "link" variant carries no box, so it deliberately ignores size.
 */
export function buttonClassName({
  variant,
  size,
  isSelected = false,
  className,
}: ButtonClassNameOptions): string {
  return [
    styles.button,
    styles[variant],
    variant === "link" ? undefined : styles[size],
    isSelected ? styles.selected : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function buttonIconClassName(): string {
  return styles.icon;
}
