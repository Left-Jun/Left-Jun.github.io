import type { SiteLanguage } from "./seo";

export interface LanguageSwitchOptions {
  lang?: SiteLanguage;
  active?: string;
  alternateUrl?: string;
  alternatePath?: string;
}

export interface SidebarMenuItem {
  identifier?: string;
  url?: string;
}

export function resolveAboutUrl(menu?: readonly SidebarMenuItem[], lang?: SiteLanguage): string;
export function resolveLanguageSwitchUrl(options?: LanguageSwitchOptions): string;
