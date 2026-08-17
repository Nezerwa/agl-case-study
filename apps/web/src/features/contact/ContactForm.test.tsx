import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormFieldConfig } from "@agl/ui";
import { ContactForm } from "./ContactForm";

/** Mirrors the Contact CMS configuration: everything required except Objet. */
const fields: FormFieldConfig[] = [
  { id: "fullName", name: "fullName", label: "Nom / Prénom (s)", type: "text", required: true, colSpan: 1 },
  { id: "phone", name: "phone", label: "N° Tél", type: "tel", required: true, colSpan: 1 },
  { id: "email", name: "email", label: "E-mail", type: "email", required: true, colSpan: 1 },
  { id: "company", name: "company", label: "Société", type: "text", required: true, colSpan: 1 },
  { id: "subject", name: "subject", label: "Objet", type: "text", colSpan: 2 },
  { id: "message", name: "message", label: "Message", type: "textarea", required: true, colSpan: 2 },
];

function renderForm(overrides: Partial<Parameters<typeof ContactForm>[0]> = {}) {
  return render(
    <ContactForm
      fields={fields}
      submitLabel="Envoyer"
      title="Envoyez-nous un message"
      {...overrides}
    />,
  );
}

/** Fills only the fields the configuration marks required — Objet stays empty. */
async function fillValid() {
  await userEvent.type(screen.getByLabelText(/Nom \/ Prénom/), "Aïcha O'Connor");
  await userEvent.type(screen.getByLabelText(/N° Tél/), "+222 45 67 89 01");
  await userEvent.type(screen.getByLabelText(/E-mail/), "aicha@example.com");
  await userEvent.type(screen.getByLabelText(/Société/), "SOGECO");
  await userEvent.type(
    screen.getByLabelText(/Message/),
    "Bonjour, je souhaite un devis pour du transport multimodal.",
  );
}

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ success: true, referenceId: "AGL-ABC12345" }),
    ...response,
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ContactForm — requiredness comes from configuration", () => {
  it("marks every configured-required control required, and only those", () => {
    renderForm();

    for (const label of [/Nom \/ Prénom/, /N° Tél/, /E-mail/, /Société/, /Message/]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByLabelText(/Objet/)).not.toBeRequired();
  });

  it("shows the required marker only on configured-required fields", () => {
    renderForm();

    expect(
      screen.getByRole("textbox", { name: /Société.*obligatoire/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Objet" })).toBeInTheDocument();
  });

  it("blocks submission on an empty configured-required field", async () => {
    const fetchMock = mockFetch({});
    renderForm();

    await fillValid();
    await userEvent.clear(screen.getByLabelText(/Société/));
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(await screen.findByText(/Société est obligatoire/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits with the optional field left empty", async () => {
    const fetchMock = mockFetch({});
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(screen.getByLabelText(/Objet/)).toHaveValue("");
  });

  /** Same component, different configuration, different validation. No code changes. */
  it("follows the configuration when a field flips to required", async () => {
    const fetchMock = mockFetch({});
    renderForm({
      fields: fields.map((field) =>
        field.name === "subject" ? { ...field, required: true } : field,
      ),
    });

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(await screen.findByText(/Objet est obligatoire/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("hardcodes no field names — an unrelated form validates from its own config", async () => {
    const fetchMock = mockFetch({});
    renderForm({
      fields: [
        { id: "reference", name: "reference", label: "Référence", type: "text", required: true },
      ],
    });

    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(await screen.findByText(/Référence est obligatoire/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("ContactForm — client validation is UX", () => {
  it("shows a field error instead of submitting an invalid form", async () => {
    const fetchMock = mockFetch({});
    renderForm();

    await userEvent.type(screen.getByLabelText(/E-mail/), "pas-une-adresse");
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(await screen.findByText(/Adresse e-mail invalide/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("associates the error with its control", async () => {
    mockFetch({});
    renderForm();

    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    await waitFor(() => {
      expect(screen.getByLabelText(/E-mail/)).toHaveAttribute("aria-invalid", "true");
    });
    expect(screen.getByLabelText(/E-mail/)).toHaveAttribute(
      "aria-describedby",
      "email-error",
    );
  });

  it("turns off native validation so only the designed messages appear", () => {
    const { container } = renderForm();

    expect(container.querySelector("form")).toHaveAttribute("noValidate");
  });
});

describe("ContactForm — submission", () => {
  it("POSTs valid values to the API as JSON", async () => {
    const fetchMock = mockFetch({});
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toMatchObject({
      fullName: "Aïcha O'Connor",
      email: "aicha@example.com",
      company: "SOGECO",
    });
  });

  it("shows a success message with the reference and clears the form", async () => {
    mockFetch({});
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    const status = await screen.findByRole("status");

    expect(status).toHaveTextContent(/votre message a bien été envoyé/i);
    expect(status).toHaveTextContent("AGL-ABC12345");
    expect(screen.getByLabelText(/Objet/)).toHaveValue("");
  });

  it("shows a generic message when the server fails, revealing nothing", async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: async () => ({ success: false, error: "SUBMISSION_FAILED" }),
    });
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent(/n'a pas pu être envoyé/i);
    expect(alert.textContent).not.toMatch(/SUBMISSION_FAILED|500/);
  });

  it("explains a rate-limited response differently from a generic failure", async () => {
    mockFetch({
      ok: false,
      status: 429,
      json: async () => ({ success: false, error: "RATE_LIMITED" }),
    });
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/patienter/i);
  });

  it("survives a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});

describe("ContactForm — double submission", () => {
  it("fires one request even when the button is clicked repeatedly", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    renderForm();
    await fillValid();

    const button = screen.getByRole("button", { name: /Envoyer/ });
    await userEvent.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveAttribute("aria-busy", "true");

    await userEvent.click(button);
    expect(fetchMock).toHaveBeenCalledOnce();

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({ success: true, referenceId: "AGL-ABC12345" }),
    });

    await screen.findByRole("status");
  });
});

describe("ContactForm — honeypot", () => {
  it("renders a field a person never meets", () => {
    const { container } = renderForm();

    const honeypot = container.querySelector("#website");

    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
    expect(honeypot?.closest("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("keeps it out of the accessibility tree", () => {
    renderForm();

    // aria-hidden on the wrapper removes it from the tree, so role queries — which
    // is what a screen reader sees — find only the six real fields.
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.queryByRole("textbox", { name: /Ne pas remplir/ })).toBeNull();
  });

  it("submits it so the server can see it was left empty", async () => {
    const fetchMock = mockFetch({});
    renderForm();

    await fillValid();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toHaveProperty("website");
  });
});
