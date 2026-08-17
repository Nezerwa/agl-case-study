import styles from "./Badge.module.css";
import type { BadgeProps } from "./Badge.types";

export type { BadgeVariant, BadgeSize, BadgeProps } from "./Badge.types";

export function Badge({
  variant = "solid",
  size = "small",
  icon,
  className,
  children,
}: BadgeProps) {
  const classNames = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classNames}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </span>
  );
}
