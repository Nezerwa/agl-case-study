import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicForm } from "@agl/ui";
import styles from "./ContactForm.module.css";
import {
  HONEYPOT_FIELD,
  buildContactSchema,
  type ContactSubmission,
} from "./contact.schema";
import type { ContactFormProps, ContactFormStatus } from "./ContactForm.types";

export type { ContactFormProps, ContactFormStatus } from "./ContactForm.types";

const GENERIC_ERROR =
  "Votre message n'a pas pu être envoyé. Merci de réessayer dans un instant.";

const RATE_LIMITED_ERROR =
  "Trop de messages envoyés depuis cet appareil. Merci de patienter quelques minutes avant de réessayer.";

/**
 * The field set is decided by the CMS, so the value map is keyed by whatever names it
 * authored — including the honeypot, which is application infrastructure rather than
 * content.
 */
type ContactFormValues = ContactSubmission;

/**
 * The Contact feature layer: React Hook Form owns field state and validation UX, and
 * this component turns its errors into the shape `DynamicForm` already accepted. The
 * form component itself stays free of both libraries — `getFieldProps` returns native
 * props, and `register()` happens to return exactly those.
 *
 * The client-side schema run is a convenience for the person filling the form. The
 * identical schema runs again in `/api/contact`, and that run is the trust boundary.
 */
export function ContactForm({
  fields,
  submitLabel,
  title,
  description,
}: ContactFormProps) {
  const [status, setStatus] = useState<ContactFormStatus>({ state: "idle" });

  // Generated from the fields the CMS supplied, so requiredness here is whatever the
  // content says — never a list maintained alongside it.
  const schema = useMemo(() => buildContactSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const fieldErrors = Object.fromEntries(
    Object.entries(errors).map(([name, error]) => [name, error?.message]),
  );

  async function onValid(values: ContactFormValues) {
    setStatus({ state: "idle" });

    // The resolver strips unknown keys, so the honeypot never survives validation. It
    // has to be re-attached explicitly, otherwise a bot driving a real browser would
    // fill the trap and the server would never see it.
    const payload = {
      ...values,
      [HONEYPOT_FIELD]: getValues(HONEYPOT_FIELD) ?? "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setStatus({ state: "success", referenceId: result.referenceId });
        reset();
        return;
      }

      setStatus({
        state: "error",
        message:
          response.status === 429 ? RATE_LIMITED_ERROR : GENERIC_ERROR,
      });
    } catch {
      setStatus({ state: "error", message: GENERIC_ERROR });
    }
  }

  return (
    <div className={styles.wrapper}>
      <DynamicForm
        fields={fields}
        submitLabel={submitLabel}
        title={title}
        description={description}
        errors={fieldErrors}
        isSubmitting={isSubmitting}
        noValidate
        onSubmit={handleSubmit(onValid)}
        getFieldProps={(field) => register(field.name as keyof ContactFormValues)}
      >
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir ce champ</label>
          <input
            id={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register(HONEYPOT_FIELD)}
          />
        </div>
      </DynamicForm>

      <div className={styles.status}>
        {status.state === "success" ? (
          <p className={styles.success} role="status">
            Merci, votre message a bien été envoyé. Notre équipe vous répondra
            rapidement. Référence : <strong>{status.referenceId}</strong>
          </p>
        ) : null}

        {status.state === "error" ? (
          <p className={styles.error} role="alert">
            {status.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
