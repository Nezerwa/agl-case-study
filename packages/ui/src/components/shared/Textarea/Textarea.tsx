import { forwardRef } from "react";
import styles from "./Textarea.module.css";
import type { TextareaProps } from "./Textarea.types";

export type { TextareaProps } from "./Textarea.types";

/**
 * The `<textarea>` counterpart to Input, with the same pass-through and ref-forwarding
 * contract. Resize is left vertical: the design fixes the height, but a long message
 * is exactly the case where a reader benefits from growing the box, and locking it to
 * `none` removes an affordance the browser gives for free.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ rows = 5, className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={[styles.textarea, className].filter(Boolean).join(" ")}
        {...rest}
      />
    );
  },
);
