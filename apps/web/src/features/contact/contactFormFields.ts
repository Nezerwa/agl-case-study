import type { FormFieldConfig } from "@agl/ui";
import { getLayout } from "@/cms/actions/layout.action";
import { mapDynamicForm } from "@/cms/adapters/form.adapter";

export const CONTACT_ROUTE = "contact";
export const CONTACT_FORM_COMPONENT = "ContactForm";

/**
 * The API's own copy of the field configuration, read from the same CMS source and
 * through the same adapter the page renders from. Both sides therefore generate their
 * schema from identical data, and requiredness cannot drift between them.
 *
 * It is deliberately **not** taken from the request. A caller who could supply the field
 * list could declare every field optional and walk straight past validation, so the
 * configuration has to be something the server already knows.
 */
export async function getContactFormFields(): Promise<FormFieldConfig[]> {
  const layout = await getLayout(CONTACT_ROUTE);
  const components = layout.sitecore.route?.placeholders.main ?? [];
  const form = components.find(
    (component) => component.componentName === CONTACT_FORM_COMPONENT,
  );

  return form ? mapDynamicForm(form).fields : [];
}
