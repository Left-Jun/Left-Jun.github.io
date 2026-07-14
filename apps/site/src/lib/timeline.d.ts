import type { SiteEntry, SiteLanguage, UpdateKind } from "./content.js";

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

export interface TimelineFilterOption {
  value: string;
  label: string;
  count: number;
}

export const TIMELINE_FILTER_GROUPS: TimelineFilterGroup[];
export function toTimelineEntry(entry: SiteEntry): TimelineEntry | null;
export function buildTimelineEntries(entries?: SiteEntry[]): TimelineEntry[];
export function selectTimelineSpotlight(entries?: TimelineEntry[]): TimelineEntry | null;
export function splitTimelineEntries(entries?: TimelineEntry[], spotlight?: TimelineEntry | null): {
  spotlight: TimelineEntry | null;
  updates: TimelineEntry[];
  archive: TimelineEntry[];
};
export function groupTimelineByMonth(entries?: TimelineEntry[], lang?: SiteLanguage): Array<{
  key: string;
  year: string;
  label: string;
  entries: TimelineEntry[];
}>;
export function groupTimelineArchiveByYear(entries?: TimelineEntry[]): Array<{
  year: string;
  entries: TimelineEntry[];
}>;
export function buildTimelineFilterOptions(entries?: TimelineEntry[], lang?: SiteLanguage): {
  groups: TimelineFilterOption[];
  years: TimelineFilterOption[];
};
export function timelineEntryCopy(entry: TimelineEntry, lang?: SiteLanguage): {
  source: string;
  kind: string;
  status: string;
  cta: string;
};
