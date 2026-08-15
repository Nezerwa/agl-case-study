import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { GetStaticPropsContext } from "next";
import type { CmsLayout } from "@agl/cms-types";
import { getLayout } from "@/cms/actions/layout.action";
import ActualitesPage, { getStaticProps } from "@/pages/actualites";

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

describe("actualites getStaticProps", () => {
  it("supplies the actualites layout as page props", async () => {
    const result = await getStaticProps({} as GetStaticPropsContext);

    expect(result).toMatchObject({
      props: { layout: { sitecore: { route: { name: "actualites" } } } },
    });
  });

  it("does not return a notFound result for a route that exists", async () => {
    const result = await getStaticProps({} as GetStaticPropsContext);

    expect(result).not.toHaveProperty("notFound");
  });
});

describe("ActualitesPage", () => {
  it("renders the components declared in the main placeholder", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
  });

  it("renders the unknown-component notice for unregistered components", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(screen.getByRole("note")).toHaveTextContent("NewsletterBanner");
  });

  it("renders nothing when the layout carries no route", () => {
    const { container } = render(<ActualitesPage layout={routelessLayout} />);

    expect(container).toBeEmptyDOMElement();
  });
});
