import type { CmsLayout } from "@agl/cms-types";

export const actualitesLayout: CmsLayout = {
  sitecore: {
    context: {
      site: { name: "agl-group" },
      language: "fr",
      pageEditing: false,
    },
    route: {
      name: "actualites",
      displayName: "Actualités",
      itemLanguage: "fr",
      placeholders: {
        main: [
          {
            uid: "b1f4c0a2-0d6e-4a19-9a3f-7c2e5d81a001",
            componentName: "Hero",
            dataSource: "/sitecore/content/agl/actualites/hero",
            fields: {
              eyebrow: { value: "AGL Group" },
              title: { value: "Nos Actualités" },
              description: {
                value:
                  "Découvrez les dernières nouvelles, communiqués de presse et événements du groupe et de ses filiales.",
              },
            },
          },
          {
            uid: "b1f4c0a2-0d6e-4a19-9a3f-7c2e5d81a002",
            componentName: "NewsletterBanner",
            dataSource: "/sitecore/content/agl/shared/newsletter",
            fields: {
              title: { value: "Restez informé" },
            },
          },
        ],
      },
    },
  },
};
