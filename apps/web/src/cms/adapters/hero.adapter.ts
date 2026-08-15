import type { CmsComponent } from "@agl/cms-types";
import type { HeroProps } from "@agl/ui";
import { readText, requireText } from "../fields";

export function mapHero(component: CmsComponent): HeroProps {
  const { fields } = component;

  return {
    eyebrow: readText(fields, "eyebrow"),
    title: requireText(fields, "title", ""),
    description: readText(fields, "description"),
  };
}
