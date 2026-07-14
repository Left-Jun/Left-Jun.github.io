import type { SiteEntry } from "./content.js";

export type ProjectPortfolioType = "game" | "embedded" | "web";
export type ProjectPortfolioFilter = "all" | ProjectPortfolioType;

export const PROJECT_PORTFOLIO_TYPES: ProjectPortfolioType[];
export const PROJECT_PORTFOLIO_FILTERS: ProjectPortfolioFilter[];
export const DEFAULT_CORE_PROJECT_COUNT: number;

export function projectIdentity(entry: SiteEntry): string;
export function compareFeaturedProjects(left: SiteEntry, right: SiteEntry): number;
export function compareFallbackProjects(left: SiteEntry, right: SiteEntry): number;
export function selectCoreProjects(projects: SiteEntry[], limit?: number): SiteEntry[];
export function splitProjectPortfolio(projects: SiteEntry[], limit?: number): {
  core: SiteEntry[];
  archive: SiteEntry[];
};
export function projectPortfolioType(entry: SiteEntry): ProjectPortfolioType | "other";
export function buildProjectTypeCounts(projects: SiteEntry[]): Record<ProjectPortfolioFilter, number>;
export function normalizeProjectFilter(
  value?: string,
  allowed?: readonly ProjectPortfolioFilter[]
): ProjectPortfolioFilter;
export function projectMatchesFilter(entry: SiteEntry, filter?: string): boolean;
export function filterProjectSections(
  sections: { core: SiteEntry[]; archive: SiteEntry[] },
  requestedFilter?: string
): {
  filter: ProjectPortfolioFilter;
  core: SiteEntry[];
  archive: SiteEntry[];
  coreVisible: boolean;
  archiveVisible: boolean;
  visibleCount: number;
};
