import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "filter" | "link";

export type ButtonSize = "medium" | "large";

export type ButtonIconPosition = "left" | "right";

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  isSelected?: boolean;
  isLoading?: boolean;
  children: ReactNode;
}

export interface ButtonProps
  extends ButtonOwnProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {}
