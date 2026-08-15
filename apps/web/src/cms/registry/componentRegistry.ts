import type { ComponentType } from "react";
import type { CmsComponent } from "@agl/cms-types";
import { Hero } from "@agl/ui";
import { mapHero } from "../adapters/hero.adapter";

type CmsProps = Record<string, unknown>;

export interface CmsComponentDefinition {
  component: ComponentType<CmsProps>;
  adapt: (cmsComponent: CmsComponent) => CmsProps;
}

function define<TProps extends object>(
  component: ComponentType<TProps>,
  adapt: (cmsComponent: CmsComponent) => TProps,
): CmsComponentDefinition {
  return {
    component: component as ComponentType<CmsProps>,
    adapt: adapt as (cmsComponent: CmsComponent) => CmsProps,
  };
}

const registry: Record<string, CmsComponentDefinition> = {
  Hero: define(Hero, mapHero),
};

export function resolveCmsComponent(
  componentName: string,
): CmsComponentDefinition | undefined {
  if (!Object.hasOwn(registry, componentName)) {
    return undefined;
  }

  return registry[componentName];
}

export function registeredComponentNames(): string[] {
  return Object.keys(registry);
}
