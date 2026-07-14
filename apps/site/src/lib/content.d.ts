export type SiteLanguage = "zh-cn" | "en";
export type ContentSection = "projects" | "posts" | "retrospectives" | "plans" | "updates" | "pages";
export type ContentStatus = "planned" | "in-progress" | "completed" | "paused" | "archived";
export type UpdateKind = "project" | "event" | "award" | "training" | "research" | "release" | "article";
export type ProjectLinkKind = "playable" | "store" | "video" | "source" | "report" | "site" | "evidence";

export interface ProjectLink {
  label: string;
  url: string;
  icon?: string;
  kind?: ProjectLinkKind;
}

export interface ProjectFacts {
  developmentTime?: string;
  duration?: string;
  team?: string;
  event?: string;
  competition?: string;
  role?: string;
  roleNote?: string;
  tools?: string;
  techNote?: string;
  platform?: string;
  platformNote?: string;
  finishedAt?: string;
  trailerDuration?: string;
  result?: string;
}

export interface SiteEntryData {
  title: string;
  date?: Date;
  updatedAt?: Date;
  status?: ContentStatus;
  kind?: UpdateKind;
  contribution?: string;
  result?: string;
  draft?: boolean;
  slug?: string;
  description?: string;
  summary?: string;
  image?: string;
  imagePosition?: string;
  coverVideo?: string;
  categories: string[];
  tags: string[];
  relatedPages: string[];
  roleTags: string[];
  columnIds: string[];
  portfolioType?: string;
  projectFacts?: ProjectFacts;
  projectLinks?: ProjectLink[];
  featured?: boolean;
  featuredWeight?: number;
  homeHeroWeight?: number;
  pinWeight?: number;
  weight?: number;
  countSuffix?: string;
  typeTitle?: string;
  indexTitle?: string;
  singleViewLabel?: string;
  gridViewLabel?: string;
  gameFilterLabel?: string;
  embeddedFilterLabel?: string;
  webFilterLabel?: string;
  viewAriaLabel?: string;
  filterAriaLabel?: string;
  [key: string]: unknown;
}

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

export interface SiteEntry {
  id: string;
  collection: ContentSection;
  section: ContentSection;
  lang: SiteLanguage;
  data: SiteEntryData;
  body: string;
  isSectionIndex: boolean;
  slug: string;
  ref: string;
  url: string;
  asset(value: string): string;
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  formattedDate: string;
  [key: string]: unknown;
}

export type TimelineSource = "updates" | "projects" | "posts" | "retrospectives" | "plans";
export type TimelineKind = UpdateKind | "retrospective" | "plan";
export type TimelineFilterGroup = "project-progress" | "events-awards" | "learning-research" | "publishing-writing";

export interface TimelineEntry extends SiteEntry {
  timelineKind: TimelineKind;
  source: TimelineSource;
  monthKey: string;
  year: string;
  filterGroup: TimelineFilterGroup;
  timelineRelatedEntries: SiteEntry[];
}

export interface SectionPage {
  data: SiteEntryData;
  body: string;
  html: string;
  url: string;
  lang: SiteLanguage;
}

export interface SiteText {
  lang: SiteLanguage;
  isEn: boolean;
  sidebar: {
    compact: boolean;
    emoji: string;
    status: { emoji: string; title: string; description: string };
    identity: string;
    subtitle: string;
    avatar: string;
  };
  menus: {
    main: MenuItem[];
    social: MenuItem[];
  };
  sections: Partial<Record<ContentSection, string>>;
  languageName: string;
  homeUrl: string;
  switchUrl: string;
  switchLabel: string;
  darkMode: string;
  lightMode: string;
  allProjects: string;
  allPosts: string;
  allPlans: string;
  allUpdates: string;
  viewProject: string;
  portfolioPdf: string;
  aboutMe: string;
  contact: string;
  selectedWork: string;
  representativeProjects: string;
  howIWork: string;
  fromIdea: string;
  inProgress: string;
  developmentPlans: string;
  latestNotes: string;
  postsAndRecords: string;
  projectProfile: string;
  projectLinks: string;
  relatedRecords: string;
  relatedReading: string;
  toc: string;
  readMinutes: string;
  viewRetrospective: string;
  viewPlan: string;
}

export interface MenuItem {
  identifier: string;
  name: string;
  url: string;
  weight: number;
  params: { icon: string; newTab?: boolean };
}

export interface WorkflowItem {
  icon: string;
  title: { zh: string; en: string };
  body: { zh: string; en: string };
  slugs: string[];
}

export interface EntryOptions {
  includeIndexes?: boolean;
  includeDrafts?: boolean;
  lang?: SiteLanguage;
}

export const config: typeof siteConfig;
export const sectionMeta: typeof sections;
export const sectionsWithLists: ContentSection[];
export function languageKey(lang?: string | null): SiteLanguage;
export function isEnglish(lang?: string | null): boolean;
export function pageLanguage(entry: Pick<SiteEntry, "id">): SiteLanguage;
export function getEntries(section: ContentSection, options?: EntryOptions): Promise<SiteEntry[]>;
export function getAllEntries(options?: EntryOptions): Promise<SiteEntry[]>;
export function getTimelineEntries(lang?: SiteLanguage): Promise<TimelineEntry[]>;
export function getEntryBySlug(section: ContentSection, slug: string, lang?: SiteLanguage): Promise<SiteEntry | undefined>;
export function getPageBySlug(slug: string, lang?: SiteLanguage): Promise<SiteEntry | undefined>;
export function getSectionPage(section: ContentSection, lang?: SiteLanguage): Promise<SiteEntry | SectionPage>;
export function relatedEntries(entry: SiteEntry): Promise<SiteEntry[]>;
export function taxonomySlug(value: string): string;
export function taxonomyTermUrl(kind: string, term: string, lang?: SiteLanguage): string;
export function getTaxonomyTerms(kind: string, lang?: SiteLanguage): Promise<Array<{ slug: string; name: string; entries: SiteEntry[] }>>;
export function getTaxonomyTerm(kind: string, slug: string, lang?: SiteLanguage): Promise<{ slug: string; name: string; entries: SiteEntry[] } | null>;
export function resolveRelated(ref: string, lang?: SiteLanguage): Promise<SiteEntry | null>;
export function siteText(lang?: string | null): SiteText;
export const workflowItems: WorkflowItem[];
import siteConfig from "../data/site-config.json";
import sections from "../data/sections.json";
