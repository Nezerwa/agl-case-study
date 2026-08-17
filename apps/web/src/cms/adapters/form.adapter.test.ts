import { describe, expect, it } from "vitest";
import type { CmsComponent } from "@agl/cms-types";
import {
  DEFAULT_COL_SPAN,
  DEFAULT_SUBMIT_LABEL,
  mapColSpan,
  mapDynamicForm,
  mapFormFieldType,
  mapFormFields,
} from "./form.adapter";

function formComponent(fields: CmsComponent["fields"]): CmsComponent {
  return { uid: "u1", componentName: "DynamicForm", fields };
}

function withFields(value: unknown): CmsComponent {
  return formComponent({ formFields: { value } });
}

const emailField = {
  id: "email",
  name: "email",
  label: "E-mail",
  type: "email",
  placeholder: "votre@email.com",
  required: true,
  colSpan: 1,
};

describe("mapFormFieldType", () => {
  it("accepts every supported type", () => {
    expect(mapFormFieldType("text")).toBe("text");
    expect(mapFormFieldType("email")).toBe("email");
    expect(mapFormFieldType("tel")).toBe("tel");
    expect(mapFormFieldType("textarea")).toBe("textarea");
  });

  it("normalises casing and whitespace", () => {
    expect(mapFormFieldType("  TEXTAREA ")).toBe("textarea");
  });

  it("rejects anything outside the allowlist", () => {
    expect(mapFormFieldType("password")).toBeUndefined();
    expect(mapFormFieldType("file")).toBeUndefined();
    expect(mapFormFieldType("script")).toBeUndefined();
    expect(mapFormFieldType(42)).toBeUndefined();
    expect(mapFormFieldType(undefined)).toBeUndefined();
    expect(mapFormFieldType("toString")).toBeUndefined();
  });
});

describe("mapColSpan", () => {
  it("accepts a full-width span", () => {
    expect(mapColSpan(2)).toBe(2);
    expect(mapColSpan("2")).toBe(2);
  });

  it("falls back to half width for anything else", () => {
    expect(mapColSpan(1)).toBe(DEFAULT_COL_SPAN);
    expect(mapColSpan(3)).toBe(DEFAULT_COL_SPAN);
    expect(mapColSpan("wide")).toBe(DEFAULT_COL_SPAN);
    expect(mapColSpan(undefined)).toBe(DEFAULT_COL_SPAN);
  });
});

describe("mapFormFields", () => {
  it("maps a complete CMS field", () => {
    expect(mapFormFields(withFields([emailField]))[0]).toEqual({
      id: "email",
      name: "email",
      label: "E-mail",
      type: "email",
      placeholder: "votre@email.com",
      hint: undefined,
      required: true,
      colSpan: 1,
    });
  });

  it("keeps the authored order", () => {
    const fields = mapFormFields(
      withFields([
        emailField,
        { name: "message", label: "Message", type: "textarea" },
      ]),
    );

    expect(fields.map((field) => field.name)).toEqual(["email", "message"]);
  });

  it("falls back to the name when no id is authored", () => {
    expect(
      mapFormFields(withFields([{ name: "subject", label: "Objet", type: "text" }]))[0]
        .id,
    ).toBe("subject");
  });

  it("treats a missing required flag as optional", () => {
    expect(
      mapFormFields(withFields([{ name: "company", label: "Société", type: "text" }]))[0]
        .required,
    ).toBe(false);
  });

  it("only treats a real boolean as required", () => {
    const fields = mapFormFields(
      withFields([{ name: "a", label: "A", type: "text", required: "yes" }]),
    );

    expect(fields[0].required).toBe(false);
  });

  it("maps several textareas without special-casing any name", () => {
    const fields = mapFormFields(
      withFields([
        { name: "requirements", label: "Besoins", type: "textarea" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]),
    );

    expect(fields.every((field) => field.type === "textarea")).toBe(true);
  });
});

describe("mapFormFields — malformed content", () => {
  it("returns an empty list when the field is absent or not an array", () => {
    expect(mapFormFields(formComponent({}))).toEqual([]);
    expect(mapFormFields(withFields("nope"))).toEqual([]);
    expect(mapFormFields(withFields(null))).toEqual([]);
  });

  it("drops entries that are not objects", () => {
    expect(mapFormFields(withFields(["a", 7, null, emailField]))).toHaveLength(1);
  });

  it("drops a field with an unsupported type rather than guessing one", () => {
    const fields = mapFormFields(
      withFields([
        { name: "password", label: "Mot de passe", type: "password" },
        emailField,
      ]),
    );

    expect(fields).toHaveLength(1);
    expect(fields[0].name).toBe("email");
  });

  it("drops a field with no name or no label", () => {
    expect(mapFormFields(withFields([{ label: "E-mail", type: "email" }]))).toEqual([]);
    expect(mapFormFields(withFields([{ name: "email", type: "email" }]))).toEqual([]);
  });

  it("does not read inherited properties", () => {
    expect(mapFormFields(withFields([Object.create(emailField)]))).toEqual([]);
  });
});

describe("mapDynamicForm", () => {
  it("maps title, description, submit label and fields", () => {
    const props = mapDynamicForm(
      formComponent({
        title: { value: "Envoyez-nous un message" },
        description: { value: "Pour plus d'informations" },
        submitLabel: { value: "Envoyer" },
        formFields: { value: [emailField] },
      }),
    );

    expect(props.title).toBe("Envoyez-nous un message");
    expect(props.description).toBe("Pour plus d'informations");
    expect(props.submitLabel).toBe("Envoyer");
    expect(props.fields).toHaveLength(1);
  });

  it("falls back to a usable submit label rather than an empty button", () => {
    expect(mapDynamicForm(formComponent({})).submitLabel).toBe(DEFAULT_SUBMIT_LABEL);
  });

  it("hands the UI no CMS shapes", () => {
    const props = mapDynamicForm(withFields([emailField]));

    expect(Object.keys(props.fields[0]).sort()).toEqual([
      "colSpan",
      "hint",
      "id",
      "label",
      "name",
      "placeholder",
      "required",
      "type",
    ]);
  });
});
