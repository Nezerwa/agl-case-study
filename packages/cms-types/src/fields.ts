export interface CmsTextField {
  value: string;
}

export interface CmsRichTextField {
  value: string;
}

export interface CmsNumberField {
  value: number;
}

export interface CmsDateField {
  value: string;
}

export interface CmsImageValue {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CmsImageField {
  value: CmsImageValue;
}

export interface CmsLinkValue {
  href: string;
  text?: string;
  title?: string;
  target?: "_blank" | "_self";
}

export interface CmsLinkField {
  value: CmsLinkValue;
}

export type CmsField =
  | CmsTextField
  | CmsRichTextField
  | CmsNumberField
  | CmsDateField
  | CmsImageField
  | CmsLinkField;
