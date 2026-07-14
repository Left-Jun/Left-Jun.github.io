import type { SiteEntry, SiteLanguage } from "./content.js";

export interface PostColumnLink {
  id: string;
  label: string;
  url: string;
}

export interface PostColumn {
  id: string;
  accent: string;
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

export interface PostFilterOption {
  value: string;
  label: string;
  count: number;
}

export const POST_FILTER_MIN_ITEMS: number;
export const STANDALONE_COLUMN_ID: "standalone";
export function postColumnUrl(id: string, lang?: SiteLanguage): string;
export function getPostColumnDefinitions(lang?: SiteLanguage): Array<Omit<PostColumn, "entries" | "latestEntry">>;
export function postMatchesColumn(entry: SiteEntry, column: Pick<PostColumn, "id">): boolean;
export function getPostColumns(posts: SiteEntry[], lang?: SiteLanguage): PostColumn[];
export function getPostColumnBadgesBySlug(posts: SiteEntry[], columns: PostColumn[]): Map<string, string[]>;
export function getPostColumnLinksBySlug(posts: SiteEntry[], columns: PostColumn[]): Map<string, PostColumnLink[]>;
export function selectPostSpotlight(posts: SiteEntry[]): SiteEntry | null;
export function splitPostsForIndex(posts: SiteEntry[], lang?: SiteLanguage): {
  spotlight: SiteEntry | null;
  columns: PostColumn[];
  archive: SiteEntry[];
};
export function buildPostFilterOptions(posts: SiteEntry[], lang?: SiteLanguage): {
  columns: PostFilterOption[];
  years: PostFilterOption[];
};
export function shouldShowPostFilters(
  posts: SiteEntry[],
  options?: { columns: PostFilterOption[]; years: PostFilterOption[] },
  minItems?: number
): boolean;
