import type { FormEvent } from "react";
import styles from "./DynamicForm.module.css";
import { Button } from "../../shared/Button/Button";
import { FormField } from "../../shared/FormField/FormField";
import { Input } from "../../shared/Input/Input";
import { Textarea } from "../../shared/Textarea/Textarea";
import type { DynamicFormProps, FormFieldConfig } from "./DynamicForm.types";

export type {
  FormFieldType,
  FormFieldColSpan,
  FormFieldConfig,
  FormControlRef,
  FormControlProps,
  DynamicFormHeadingLevel,
  DynamicFormProps,
} from "./DynamicForm.types";

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.5 2.5 9.167 10.833M17.5 2.5l-5.833 15-3.334-6.667L1.667 7.5 17.5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function DynamicForm({
  fields,
  submitLabel,
  title,
  description,
  headingLevel = "h2",
  errors,
  isSubmitting = false,
  onSubmit,
  getFieldProps,
  requiredLabel,
  noValidate = false,
  children,
  className,
}: DynamicFormProps) {
  const Heading = headingLevel;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event);
  }

  function renderControl(field: FormFieldConfig) {
    const control = getFieldProps?.(field) ?? { name: field.name };

    return (
      <FormField
        key={field.id}
        id={field.id}
        label={field.label}
        required={field.required}
        hint={field.hint}
        error={errors?.[field.name]}
        requiredLabel={requiredLabel}
        className={field.colSpan === 2 ? styles.spanFull : undefined}
      >
        {(fieldControl) =>
          field.type === "textarea" ? (
            <Textarea
              {...fieldControl}
              {...control}
              placeholder={field.placeholder}
              rows={field.rows}
            />
          ) : (
            <Input
              {...fieldControl}
              {...control}
              type={field.type}
              placeholder={field.placeholder}
            />
          )
        }
      </FormField>
    );
  }

  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")}>
      {title || description ? (
        <header className={styles.header}>
          {title ? <Heading className={styles.title}>{title}</Heading> : null}
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </header>
      ) : null}

      <form className={styles.card} onSubmit={handleSubmit} noValidate={noValidate}>
        <div className={styles.grid}>{fields.map(renderControl)}</div>

        {children}

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            icon={<SendIcon />}
            iconPosition="left"
            isLoading={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}
