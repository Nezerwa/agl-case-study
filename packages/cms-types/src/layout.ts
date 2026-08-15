import type { CmsFields, CmsPlaceholders } from "./components";

export interface CmsContext {
  site: { name: string };
  language: string;
  pageEditing: boolean;
}

export interface CmsRoute {
  name: string;
  displayName?: string;
  itemLanguage: string;
  fields?: CmsFields;
  placeholders: CmsPlaceholders;
}

export interface CmsLayout {
  sitecore: {
    context: CmsContext;
    route: CmsRoute | null;
  };
}
