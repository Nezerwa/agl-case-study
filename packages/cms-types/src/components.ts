export type CmsFields = Record<string, unknown>;

export interface CmsComponent<TFields extends CmsFields = CmsFields> {
  uid: string;
  componentName: string;
  dataSource?: string;
  fields: TFields;
  placeholders?: CmsPlaceholders;
}

export type CmsPlaceholders = Record<string, CmsComponent[]>;
