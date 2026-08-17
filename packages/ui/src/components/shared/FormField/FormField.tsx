import styles from "./FormField.module.css";
import type { FormFieldControl, FormFieldProps } from "./FormField.types";

export type { FormFieldControl, FormFieldProps } from "./FormField.types";

export function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  requiredLabel = "obligatoire",
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control: FormFieldControl = {
    id,
    required: required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true"> *</span>
            <span className={styles.srOnly}> {requiredLabel}</span>
          </>
        ) : null}
      </label>

      {children(control)}

      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
