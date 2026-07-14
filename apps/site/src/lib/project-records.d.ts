import type { SiteEntry } from "./content.js";

export type RecordView = "all" | "retrospectives" | "plans" | "complete";

export interface ProjectRecordThread {
  key: string;
  anchorId: string;
  projectRef: string;
  project: SiteEntry | null;
  retrospectives: SiteEntry[];
  plans: SiteEntry[];
  latestTimestamp: number;
  pinWeight: number;
  fallbackEntry: SiteEntry | null;
  title: string;
  hasRetrospective: boolean;
  hasPlan: boolean;
  isComplete: boolean;
}

export const RECORD_VIEWS: RecordView[];
export function buildProjectRecordThreads(input?: {
  projects?: SiteEntry[];
  retrospectives?: SiteEntry[];
  plans?: SiteEntry[];
}): ProjectRecordThread[];
export function normalizeRecordView(view?: string): RecordView;
export function recordThreadMatchesView(thread: ProjectRecordThread, view?: RecordView): boolean;
export function visibleRecordPhases(thread: ProjectRecordThread, view?: RecordView): {
  retrospectives: boolean;
  plans: boolean;
};
export function recordThreadStats(threads?: ProjectRecordThread[]): {
  threads: number;
  retrospectives: number;
  plans: number;
  complete: number;
};
export function recordViewCounts(threads?: ProjectRecordThread[]): Record<RecordView, number>;
