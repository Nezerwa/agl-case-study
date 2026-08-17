import type { NewsGridItem } from "@agl/ui";

const IMAGE_DIR = "/images/news";

/**
 * The same six articles the Actualités mock authors, in the same order, served from
 * the same files in `apps/web/public` — Storybook reaches them through `staticDirs`
 * rather than keeping a second copy.
 *
 * Titles, dates and categories are the supplied design content. Descriptions are
 * still placeholder copy pending the real text.
 */
export const newsArticles: NewsGridItem[] = [
  {
    id: "salon-international-logistique-2026",
    image: {
      src: `${IMAGE_DIR}/Image (SOGECO participe au Salon International de la Logistique 2026).png`,
      alt: "Silhouette du continent africain découpée dans une surface de pierre claire",
    },
    categoryLabel: "Événements",
    date: "15 Mars 2026",
    title: "SOGECO participe au Salon International de la Logistique 2026",
    description:
      "SOGECO participera au Salon International de la Logistique pour y présenter ses solutions de transport multimodal.",
    href: "/actualites/salon-international-logistique-2026",
  },
  {
    id: "projet-gazier-gta",
    image: {
      src: `${IMAGE_DIR}/Image (SOGECO renforce sa position dans le projet gazier GTA).png`,
      alt: "Façade vitrée d'un grand centre de congrès avec des visiteurs à l'entrée",
    },
    categoryLabel: "Presse",
    date: "08 Mars 2026",
    title: "SOGECO renforce sa position dans le projet gazier GTA",
    description:
      "Le groupe consolide son rôle logistique sur le projet gazier Grand Tortue Ahmeyim.",
    href: "/actualites/projet-gazier-gta",
  },
  {
    id: "inauguration-nouvelles-installations",
    image: {
      src: `${IMAGE_DIR}/Image (Inauguration de nouvelles installations au port de Ndiago).png`,
      alt: "Vue en soirée sur un port à conteneurs depuis une terrasse en hauteur",
    },
    categoryLabel: "Événements",
    date: "22 Février 2026",
    title: "Inauguration de nouvelles installations au port de Ndiago",
    description:
      "De nouvelles installations d'entreposage entrent en service pour accompagner la croissance des volumes traités.",
    href: "/actualites/inauguration-nouvelles-installations",
  },
  {
    id: "partenariat-africa-global-logistics",
    image: {
      src: `${IMAGE_DIR}/Image (Partenariat stratégique avec Africa Global Logistics).png`,
      alt: "Deux autobus articulés aux livrées orange et bleue stationnés en bord de route",
    },
    categoryLabel: "Presse",
    date: "10 Février 2026",
    title: "Partenariat stratégique avec Africa Global Logistics",
    description:
      "Un partenariat qui élargit la couverture du réseau logistique sur le continent.",
    href: "/actualites/partenariat-africa-global-logistics",
  },
  {
    id: "formation-collaborateurs-qhse",
    image: {
      src: `${IMAGE_DIR}/Image (Formation de 50 nouveaux collaborateurs aux normes Q-HSE).png`,
      alt: "Intérieur d'un entrepôt logistique avec rayonnages de stockage sur plusieurs niveaux",
    },
    categoryLabel: "Événements",
    date: "28 Janvier 2026",
    title: "Formation de 50 nouveaux collaborateurs aux normes Q-HSE",
    description:
      "Cinquante collaborateurs ont achevé le programme de formation aux normes qualité, hygiène, sécurité et environnement.",
    href: "/actualites/formation-collaborateurs-qhse",
  },
  {
    id: "certification-internationale",
    image: {
      src: `${IMAGE_DIR}/Image (SOGECO reçoit une certification internationale pour ses opérations).png`,
      alt: "Navire cargo près d'un littoral",
    },
    categoryLabel: "Presse",
    date: "15 Janvier 2026",
    title: "SOGECO reçoit une certification internationale pour ses opérations",
    description:
      "La certification confirme la conformité des opérations aux standards internationaux du secteur.",
    href: "/actualites/certification-internationale",
  },
];
