import { siteConfigMock } from "../mocks/siteConfig.mock";
import type { SiteConfig } from "../siteConfig.types";

export function fetchSiteConfig(): SiteConfig {
  return siteConfigMock;
}
