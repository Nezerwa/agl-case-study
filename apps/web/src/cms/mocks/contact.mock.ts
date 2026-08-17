import type { CmsLayout } from "@agl/cms-types";

export const contactLayout: CmsLayout = {
  sitecore: {
    context: {
      site: { name: "agl-group" },
      language: "fr",
      pageEditing: false,
    },
    route: {
      name: "contact",
      displayName: "Contact",
      itemLanguage: "fr",
      placeholders: {
        main: [
          {
            uid: "c7a2e9d1-4b83-4f56-9c02-1a6d3f7b5e01",
            componentName: "Hero",
            dataSource: "/sitecore/content/agl/contact/hero",
            fields: {
              title: { value: "Contactez-nous" },
              description: {
                value:
                  "Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets logistiques",
              },
              variant: { value: "brand" },
              align: { value: "left" },
              headingLevel: { value: "h1" },
            },
          },
          {
            uid: "c7a2e9d1-4b83-4f56-9c02-1a6d3f7b5e02",
            componentName: "ContactForm",
            dataSource: "/sitecore/content/agl/contact/form",
            fields: {
              title: { value: "Envoyez-nous un message" },
              description: {
                value: "Pour plus d'informations n'hésitez pas à nous contacter",
              },
              submitLabel: { value: "Envoyer" },
              formFields: {
                value: [
                  {
                    id: "fullName",
                    name: "fullName",
                    label: "Nom / Prénom (s)",
                    type: "text",
                    placeholder: "Votre nom complet",
                    required: true,
                    colSpan: 1,
                  },
                  {
                    id: "phone",
                    name: "phone",
                    label: "N° Tél",
                    type: "tel",
                    placeholder: "+222 XX XX XX XX",
                    required: true,
                    colSpan: 1,
                  },
                  {
                    id: "email",
                    name: "email",
                    label: "E-mail",
                    type: "email",
                    placeholder: "votre@email.com",
                    required: true,
                    colSpan: 1,
                  },
                  {
                    id: "company",
                    name: "company",
                    label: "Société",
                    type: "text",
                    placeholder: "Nom de votre société",
                    required: true,
                    colSpan: 1,
                  },
                  {
                    id: "subject",
                    name: "subject",
                    label: "Objet",
                    type: "text",
                    placeholder: "Objet de votre message",
                    colSpan: 2,
                  },
                  {
                    id: "message",
                    name: "message",
                    label: "Message",
                    type: "textarea",
                    placeholder: "Votre message...",
                    required: true,
                    colSpan: 2,
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};
