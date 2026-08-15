import styles from "./Button.module.css";
import type { ButtonProps } from "./Button.types";

export type { ButtonProps, ButtonVariant } from "./Button.types";

export function Button({
  variant = "primary",
  isLoading = false,
  disabled = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classNames = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
