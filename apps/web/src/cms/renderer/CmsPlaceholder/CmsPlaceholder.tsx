import { CmsComponentRenderer } from "../CmsComponentRenderer/CmsComponentRenderer";
import type { CmsPlaceholderProps } from "./CmsPlaceholder.types";

export function CmsPlaceholder({ name, placeholders }: CmsPlaceholderProps) {
  const components = placeholders[name];

  if (!components || components.length === 0) {
    return null;
  }

  return (
    <>
      {components.map((component) => (
        <CmsComponentRenderer key={component.uid} component={component} />
      ))}
    </>
  );
}
