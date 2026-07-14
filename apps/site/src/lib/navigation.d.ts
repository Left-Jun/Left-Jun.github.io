import type { SiteLanguage } from "./seo";

export interface LanguageSwitchOptions {
  lang?: SiteLanguage;
  active?: string;
  alternateUrl?: string;
  alternatePath?: string;
}

export function resolveLanguageSwitchUrl(options?: LanguageSwitchOptions): string;
