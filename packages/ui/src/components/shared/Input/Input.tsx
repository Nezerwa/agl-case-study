import { forwardRef } from "react";
import styles from "./Input.module.css";
import type { InputProps } from "./Input.types";

export type { InputType, InputProps } from "./Input.types";

/**
 * A thin wrapper over `<input>`: every native attribute passes through and the ref is
 * forwarded, which is what lets a form library own the value without this package
 * knowing one exists. The error look is driven by `aria-invalid`, so the styling and
 * the accessible state can never disagree.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={[styles.input, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});
