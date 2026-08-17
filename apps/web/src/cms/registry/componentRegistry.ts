import type { ComponentType } from "react";
import type { CmsComponent } from "@agl/cms-types";
import { Hero } from "@agl/ui";
import { NewsListing } from "@/components/NewsListing/NewsListing";
import { ContactForm } from "@/features/contact/ContactForm";
import { mapDynamicForm } from "../adapters/form.adapter";
import { mapHero } from "../adapters/hero.adapter";
import { mapNewsListing } from "../adapters/news.adapter";

type CmsProps = Record<string, unknown>;

export interface CmsComponentDefinition {
  component: ComponentType<CmsProps>;
  adapt: (cmsComponent: CmsComponent) => CmsProps;
}

export function defineCmsComponent<TProps extends object>(
  component: ComponentType<TProps>,
  adapt: (cmsComponent: CmsComponent) => TProps,
): CmsComponentDefinition {
  return {
    component: component as ComponentType<CmsProps>,
    adapt: adapt as (cmsComponent: CmsComponent) => CmsProps,
  };
}

const registry: Record<string, CmsComponentDefinition> = {
  Hero: defineCmsComponent(Hero, mapHero),
  NewsListing: defineCmsComponent(NewsListing, mapNewsListing),
  ContactForm: defineCmsComponent(ContactForm, mapDynamicForm),
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
