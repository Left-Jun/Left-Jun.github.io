import type { SiteEntry, SiteLanguage } from "./content.js";

export interface PostColumn {
  id: string;
  accent: string;
  terms: string[];
  url: string;
  label: string;
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  latestLabel: string;
  countSuffix: string;
  viewAll: string;
  pageTitle: string;
  pageSubtitle: string;
  allArticlesTitle: string;
  backLabel: string;
  entries: SiteEntry[];
  latestEntry: SiteEntry | null;
}

export function postColumnUrl(id: string, lang?: SiteLanguage): string;
export function getPostColumnDefinitions(lang?: SiteLanguage): Array<Omit<PostColumn, "entries" | "latestEntry">>;
export function postMatchesColumn(entry: SiteEntry, column: Pick<PostColumn, "terms">): boolean;
export function getPostColumns(posts: SiteEntry[], lang?: SiteLanguage): PostColumn[];
export function getPostColumnBadgesBySlug(posts: SiteEntry[], columns: PostColumn[]): Map<string, string[]>;
