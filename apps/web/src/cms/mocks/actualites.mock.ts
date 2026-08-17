import type { CmsLayout } from "@agl/cms-types";

const IMAGE_DIR = "/images/news";

const NEWS_IMAGES = {
  salon: `${IMAGE_DIR}/Image (SOGECO participe au Salon International de la Logistique 2026).png`,
  gta: `${IMAGE_DIR}/Image (SOGECO renforce sa position dans le projet gazier GTA).png`,
  installations: `${IMAGE_DIR}/Image (Inauguration de nouvelles installations au port de Ndiago).png`,
  partenariat: `${IMAGE_DIR}/Image (Partenariat stratégique avec Africa Global Logistics).png`,
  formation: `${IMAGE_DIR}/Image (Formation de 50 nouveaux collaborateurs aux normes Q-HSE).png`,
  certification: `${IMAGE_DIR}/Image (SOGECO reçoit une certification internationale pour ses opérations).png`,
};

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
              badgeLabel: { value: "Actualités" },
              badgeIconSrc: { value: "/icons/badge-tag.svg" },
              title: { value: "Nos Actualités" },
              description: {
                value: "Découvrez les dernières nouvelles et événements",
              },
              variant: { value: "brand" },
              align: { value: "left" },
              headingLevel: { value: "h1" },
            },
          },
          {
            uid: "b1f4c0a2-0d6e-4a19-9a3f-7c2e5d81a003",
            componentName: "NewsListing",
            dataSource: "/sitecore/content/agl/actualites/news-listing",
            fields: {
              defaultCategory: { value: "all" },
              categories: {
                value: [
                  { id: "all", label: "Tous", value: "all" },
                  { id: "events", label: "Événements", value: "events" },
                  { id: "press", label: "Presse", value: "press" },
                ],
              },
              articles: {
                value: [
                  {
                    id: "salon-international-logistique-2026",
                    category: "events",
                    categoryLabel: "Événements",
                    date: "15 Mars 2026",
                    title:
                      "SOGECO participe au Salon International de la Logistique 2026",
                    description:
                      "SOGECO participera au Salon International de la Logistique pour y présenter ses solutions de transport multimodal.",
                    image: {
                      src: NEWS_IMAGES.salon,
                      alt: "Silhouette du continent africain découpée dans une surface de pierre claire",
                    },
                    href: "/actualites/salon-international-logistique-2026",
                  },
                  {
                    id: "projet-gazier-gta",
                    category: "press",
                    categoryLabel: "Presse",
                    date: "08 Mars 2026",
                    title: "SOGECO renforce sa position dans le projet gazier GTA",
                    description:
                      "Le groupe consolide son rôle logistique sur le projet gazier Grand Tortue Ahmeyim.",
                    image: {
                      src: NEWS_IMAGES.gta,
                      alt: "Façade vitrée d'un grand centre de congrès avec des visiteurs à l'entrée",
                    },
                    href: "/actualites/projet-gazier-gta",
                  },
                  {
                    id: "inauguration-nouvelles-installations",
                    category: "events",
                    categoryLabel: "Événements",
                    date: "22 Février 2026",
                    title:
                      "Inauguration de nouvelles installations au port de Ndiago",
                    description:
                      "De nouvelles installations d'entreposage entrent en service pour accompagner la croissance des volumes traités.",
                    image: {
                      src: NEWS_IMAGES.installations,
                      alt: "Vue en soirée sur un port à conteneurs depuis une terrasse en hauteur",
                    },
                    href: "/actualites/inauguration-nouvelles-installations",
                  },
                  {
                    id: "partenariat-africa-global-logistics",
                    category: "press",
                    categoryLabel: "Presse",
                    date: "10 Février 2026",
                    title: "Partenariat stratégique avec Africa Global Logistics",
                    description:
                      "Un partenariat qui élargit la couverture du réseau logistique sur le continent.",
                    image: {
                      src: NEWS_IMAGES.partenariat,
                      alt: "Deux autobus articulés aux livrées orange et bleue stationnés en bord de route",
                    },
                    href: "/actualites/partenariat-africa-global-logistics",
                  },
                  {
                    id: "formation-collaborateurs-qhse",
                    category: "events",
                    categoryLabel: "Événements",
                    date: "28 Janvier 2026",
                    title:
                      "Formation de 50 nouveaux collaborateurs aux normes Q-HSE",
                    description:
                      "Cinquante collaborateurs ont achevé le programme de formation aux normes qualité, hygiène, sécurité et environnement.",
                    image: {
                      src: NEWS_IMAGES.formation,
                      alt: "Intérieur d'un entrepôt logistique avec rayonnages de stockage sur plusieurs niveaux",
                    },
                    href: "/actualites/formation-collaborateurs-qhse",
                  },
                  {
                    id: "certification-internationale",
                    category: "press",
                    categoryLabel: "Presse",
                    date: "15 Janvier 2026",
                    title:
                      "SOGECO reçoit une certification internationale pour ses opérations",
                    description:
                      "La certification confirme la conformité des opérations aux standards internationaux du secteur.",
                    image: {
                      src: NEWS_IMAGES.certification,
                      alt: "Navire cargo près d'un littoral",
                    },
                    href: "/actualites/certification-internationale",
                  },
                ],
              },
            },
          },
          {
            uid: "b1f4c0a2-0d6e-4a19-9a3f-7c2e5d81a004",
            componentName: "Hero",
            dataSource: "/sitecore/content/agl/actualites/newsletter",
            fields: {
              title: { value: "Restez informé" },
              description: {
                value:
                  "Inscrivez-vous à notre newsletter pour recevoir les dernières actualités",
              },
              variant: { value: "brand" },
              align: { value: "center" },
              headingLevel: { value: "h2" },
              size: { value: "large" },
            },
          },
        ],
      },
    },
  },
};
