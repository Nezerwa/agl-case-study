import { resolveCmsComponent } from "../../registry/componentRegistry";
import { UnknownComponent } from "../UnknownComponent/UnknownComponent";
import type { CmsComponentRendererProps } from "./CmsComponentRenderer.types";

export function CmsComponentRenderer({ component }: CmsComponentRendererProps) {
  const definition = resolveCmsComponent(component.componentName);

  if (!definition) {
    return <UnknownComponent componentName={component.componentName} />;
  }

  const { component: Component, adapt } = definition;

  return <Component {...adapt(component)} />;
}
