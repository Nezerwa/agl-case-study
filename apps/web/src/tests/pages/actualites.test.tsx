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
  it("renders the Hero from CMS data through the registry", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Actualités")).toBeInTheDocument();
  });

  it("renders the Hero badge icon supplied by the CMS", async () => {
    const layout = await getLayout("actualites");

    const { container } = render(<ActualitesPage layout={layout} />);

    expect(container.querySelector("img")).toHaveAttribute(
      "alt",
      "",
    );
  });

  it("renders the same Hero twice from different CMS data", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Nos Actualités" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Restez informé" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Inscrivez-vous à notre newsletter pour recevoir les dernières actualités",
      ),
    ).toBeInTheDocument();
  });

  it("gives the second Hero no badge, because its CMS data authors none", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(screen.getAllByText("Actualités")).toHaveLength(1);
  });

  it("never skips a heading level", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it("renders the card titles as h2, directly under the page h1", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(7);
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
  });

  it("resolves every component the layout asks for", async () => {
    const layout = await getLayout("actualites");

    render(<ActualitesPage layout={layout} />);

    expect(screen.queryAllByRole("note")).toHaveLength(0);
  });

  it("renders nothing when the layout carries no route", () => {
    const { container } = render(<ActualitesPage layout={routelessLayout} />);

    expect(container).toBeEmptyDOMElement();
  });
});
