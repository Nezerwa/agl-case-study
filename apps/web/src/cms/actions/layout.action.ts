import type { CmsLayout } from "@agl/cms-types";
import { actualitesLayout } from "../mocks/actualites.mock";
import { contactLayout } from "../mocks/contact.mock";

const mockLayouts: Record<string, CmsLayout> = {
  actualites: actualitesLayout,
  contact: contactLayout,
};

const notFoundLayout: CmsLayout = {
  sitecore: {
    context: {
      site: { name: "agl-group" },
      language: "fr",
      pageEditing: false,
    },
    route: null,
  },
};

export async function getLayout(routeName: string): Promise<CmsLayout> {
  if (!Object.hasOwn(mockLayouts, routeName)) {
    return notFoundLayout;
  }

  return mockLayouts[routeName];
}

export function isRouteFound(layout: CmsLayout): boolean {
  return layout.sitecore.route !== null;
}
