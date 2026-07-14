const SITE_TIME_ZONE = "Asia/Shanghai";

export const TIMELINE_FILTER_GROUPS = [
  "project-progress",
  "events-awards",
  "learning-research",
  "publishing-writing"
];

const sourceConfig = {
  updates: { kind: "project" },
  projects: { kind: "project" },
  posts: { kind: "article" },
  retrospectives: { kind: "retrospective" },
  plans: { kind: "plan" }
};

const copy = {
  "zh-cn": {
    filterGroups: {
      "project-progress": "项目进展",
      "events-awards": "活动与奖项",
      "learning-research": "学习与研究",
      "publishing-writing": "发布与文章"
    },
    sources: {
      updates: "动态",
      projects: "项目",
      posts: "文章",
      retrospectives: "项目复盘",
      plans: "开发计划"
    },
    kinds: {
      project: "项目",
      event: "活动",
      award: "奖项",
      training: "训练",
      research: "研究",
      release: "发布",
      article: "文章",
      retrospective: "复盘",
      plan: "计划"
    },
    statuses: {
      planned: "计划中",
      "in-progress": "进行中",
      completed: "已完成",
      paused: "已暂停",
      archived: "已归档"
    },
    ctas: {
      updates: "查看动态",
      projects: "查看项目",
      posts: "阅读文章",
      retrospectives: "查看复盘",
      plans: "查看计划"
    }
  },
  en: {
    filterGroups: {
      "project-progress": "Project progress",
      "events-awards": "Events & awards",
      "learning-research": "Learning & research",
      "publishing-writing": "Publishing & writing"
    },
    sources: {
      updates: "Update",
      projects: "Project",
      posts: "Article",
      retrospectives: "Retrospective",
      plans: "Development plan"
    },
    kinds: {
      project: "Project",
      event: "Event",
      award: "Award",
      training: "Training",
      research: "Research",
      release: "Release",
      article: "Article",
      retrospective: "Retrospective",
      plan: "Plan"
    },
    statuses: {
      planned: "Planned",
      "in-progress": "In progress",
      completed: "Completed",
      paused: "Paused",
      archived: "Archived"
    },
    ctas: {
      updates: "Read update",
      projects: "View project",
      posts: "Read article",
      retrospectives: "Read retrospective",
      plans: "View plan"
    }
  }
};

function languageKey(lang) {
  return lang === "en" ? "en" : "zh-cn";
}

function validDate(entry) {
  const value = entry?.data?.date;
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function filterGroupFor(source, kind) {
  if (source === "projects" || source === "retrospectives" || source === "plans") return "project-progress";
  if (source === "posts") return "publishing-writing";
  if (kind === "event" || kind === "award") return "events-awards";
  if (kind === "training" || kind === "research") return "learning-research";
  if (kind === "release" || kind === "article") return "publishing-writing";
  return "project-progress";
}

function dateParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit"
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  return { year, month, monthKey: year && month ? `${year}-${month}` : "" };
}

function compareDateDesc(a, b) {
  const aTime = validDate(a)?.getTime() || 0;
  const bTime = validDate(b)?.getTime() || 0;
  return bTime - aTime || String(a?.data?.title || "").localeCompare(String(b?.data?.title || ""));
}

export function toTimelineEntry(entry) {
  const date = validDate(entry);
  if (!date) return null;
  const source = sourceConfig[entry.section] ? entry.section : "updates";
  const sourceMeta = sourceConfig[source];
  const timelineKind = source === "updates" ? (entry.data.kind || sourceMeta.kind) : sourceMeta.kind;
  const { year, monthKey } = dateParts(date);
  return {
    ...entry,
    timelineKind,
    source,
    monthKey,
    year,
    filterGroup: filterGroupFor(source, timelineKind),
    timelineRelatedEntries: []
  };
}

export function buildTimelineEntries(entries = []) {
  const relatedByRef = new Map();
  entries.forEach((entry) => {
    if (entry?.ref) relatedByRef.set(entry.ref, entry);
    if (entry?.section && entry?.slug) relatedByRef.set(`${entry.section}/${entry.slug}`, entry);
  });
  return entries
    .map(toTimelineEntry)
    .filter(Boolean)
    .map((entry) => ({
      ...entry,
      timelineRelatedEntries: entry.source === "updates"
        ? (entry.data.relatedPages || []).map((ref) => relatedByRef.get(ref)).filter(Boolean)
        : []
    }))
    .sort(compareDateDesc);
}

export function selectTimelineSpotlight(entries = []) {
  const explicitUpdates = entries.filter((entry) => entry.source === "updates").sort(compareDateDesc);
  const featured = explicitUpdates.filter((entry) => entry.data.featured === true);
  if (featured.length === 0) return explicitUpdates[0] || null;
  return [...featured].sort((a, b) => {
    const aWeight = Number.isFinite(a.data.featuredWeight) ? a.data.featuredWeight : Number.POSITIVE_INFINITY;
    const bWeight = Number.isFinite(b.data.featuredWeight) ? b.data.featuredWeight : Number.POSITIVE_INFINITY;
    return aWeight - bWeight || compareDateDesc(a, b);
  })[0] || null;
}

export function splitTimelineEntries(entries = [], spotlight = selectTimelineSpotlight(entries)) {
  const spotlightRef = spotlight?.ref || "";
  return {
    spotlight,
    updates: entries.filter((entry) => entry.source === "updates" && entry.ref !== spotlightRef),
    archive: entries.filter((entry) => entry.source !== "updates")
  };
}

export function groupTimelineByMonth(entries = [], lang = "zh-cn") {
  const key = languageKey(lang);
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.monthKey)) {
      const date = validDate(entry);
      groups.set(entry.monthKey, {
        key: entry.monthKey,
        year: entry.year,
        label: date ? new Intl.DateTimeFormat(key === "en" ? "en-US" : "zh-CN", {
          timeZone: SITE_TIME_ZONE,
          year: "numeric",
          month: "long"
        }).format(date) : entry.monthKey,
        entries: []
      });
    }
    groups.get(entry.monthKey).entries.push(entry);
  }
  return [...groups.values()];
}

export function groupTimelineArchiveByYear(entries = []) {
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.year)) groups.set(entry.year, { year: entry.year, entries: [] });
    groups.get(entry.year).entries.push(entry);
  }
  return [...groups.values()];
}

export function buildTimelineFilterOptions(entries = [], lang = "zh-cn") {
  const key = languageKey(lang);
  const groupCounts = new Map(TIMELINE_FILTER_GROUPS.map((group) => [group, 0]));
  const yearCounts = new Map();
  for (const entry of entries) {
    groupCounts.set(entry.filterGroup, (groupCounts.get(entry.filterGroup) || 0) + 1);
    yearCounts.set(entry.year, (yearCounts.get(entry.year) || 0) + 1);
  }
  return {
    groups: TIMELINE_FILTER_GROUPS
      .filter((value) => (groupCounts.get(value) || 0) > 0)
      .map((value) => ({ value, label: copy[key].filterGroups[value], count: groupCounts.get(value) || 0 })),
    years: [...yearCounts.entries()]
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([value, count]) => ({ value, label: value, count }))
  };
}

export function timelineEntryCopy(entry, lang = "zh-cn") {
  const key = languageKey(lang);
  const labels = copy[key];
  return {
    source: labels.sources[entry.source] || entry.source,
    kind: labels.kinds[entry.timelineKind] || entry.timelineKind,
    status: entry.data.status ? (labels.statuses[entry.data.status] || entry.data.status) : "",
    cta: labels.ctas[entry.source] || (key === "en" ? "View entry" : "查看内容")
  };
}
