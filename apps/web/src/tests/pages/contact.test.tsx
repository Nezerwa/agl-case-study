import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { GetStaticPropsContext } from "next";
import type { CmsLayout } from "@agl/cms-types";
import { getLayout } from "@/cms/actions/layout.action";
import ContactPage, { getStaticProps } from "@/pages/contact";

const routelessLayout: CmsLayout = {
  sitecore: {
    context: {
      site: { name: "agl-group" },
      language: "fr",
      pageEditing: false,
    },
    route: null,
  },
};

describe("contact getStaticProps", () => {
  it("supplies the contact layout as page props", async () => {
    const result = await getStaticProps({} as GetStaticPropsContext);

    expect(result).toMatchObject({
      props: { layout: { sitecore: { route: { name: "contact" } } } },
    });
  });
});

describe("ContactPage", () => {
  it("renders the Hero from CMS data through the registry", async () => {
    const layout = await getLayout("contact");

    render(<ContactPage layout={layout} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Contactez-nous" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets logistiques",
      ),
    ).toBeInTheDocument();
  });

  it("renders exactly one h1 and no badge, because the CMS authors none", async () => {
    const layout = await getLayout("contact");

    const { container } = render(<ContactPage layout={layout} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector("img")).toBeNull();
  });

  it("renders the CMS-configured form", async () => {
    const layout = await getLayout("contact");

    render(<ContactPage layout={layout} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Envoyez-nous un message" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.getByRole("button", { name: /Envoyer/ })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("maps each CMS field type to the right control", async () => {
    const layout = await getLayout("contact");

    render(<ContactPage layout={layout} />);

    expect(screen.getByLabelText(/E-mail/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/N° Tél/)).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(/Message/).tagName).toBe("TEXTAREA");
  });

  it("never skips a heading level", async () => {
    const layout = await getLayout("contact");

    render(<ContactPage layout={layout} />);

    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it("resolves every component the layout asks for", async () => {
    const layout = await getLayout("contact");

    render(<ContactPage layout={layout} />);

    expect(screen.queryAllByRole("note")).toHaveLength(0);
  });

  it("renders nothing when the layout carries no route", () => {
    const { container } = render(<ContactPage layout={routelessLayout} />);

    expect(container).toBeEmptyDOMElement();
  });
});
