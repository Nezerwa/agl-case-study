import type { ButtonProps } from "./Button.types";
import { buttonClassName, buttonIconClassName } from "./Button.utils";

export type {
  ButtonVariant,
  ButtonSize,
  ButtonIconPosition,
  ButtonOwnProps,
  ButtonProps,
} from "./Button.types";

export function Button({
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  isSelected = false,
  isLoading = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const renderedIcon = icon ? (
    <span className={buttonIconClassName()} aria-hidden="true">
      {icon}
    </span>
  ) : null;

  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, isSelected, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-pressed={variant === "filter" ? isSelected : undefined}
      {...rest}
    >
      {iconPosition === "left" ? renderedIcon : null}
      <span>{children}</span>
      {iconPosition === "right" ? renderedIcon : null}
    </button>
  );
}
