export const RECORD_VIEWS = ["all", "retrospectives", "plans", "complete"];

function entryDate(entry) {
  const value = entry?.data?.date;
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  const timestamp = date.getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function projectReference(entry) {
  return (entry?.data?.relatedPages || []).find((ref) => String(ref).startsWith("projects/")) || "";
}

function safeAnchor(value) {
  return String(value || "record")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "record";
}

function compareRecordDate(a, b) {
  return entryDate(b) - entryDate(a) || String(a?.data?.title || "").localeCompare(String(b?.data?.title || ""));
}

export function buildProjectRecordThreads({ projects = [], retrospectives = [], plans = [] } = {}) {
  const projectByRef = new Map();
  projects.forEach((project) => {
    if (project.ref) projectByRef.set(project.ref, project);
    if (project.slug) projectByRef.set(`projects/${project.slug}`, project);
  });

  const threads = new Map();
  const records = [
    ...retrospectives.map((entry) => ({ entry, phase: "retrospectives" })),
    ...plans.map((entry) => ({ entry, phase: "plans" }))
  ];

  records.forEach(({ entry, phase }) => {
    const projectRef = projectReference(entry);
    const key = projectRef ? `project:${projectRef}` : `unlinked:${entry.ref || `${phase}/${entry.slug}`}`;
    if (!threads.has(key)) {
      const project = projectRef ? projectByRef.get(projectRef) || null : null;
      const anchorSource = project?.slug || entry.slug || key;
      threads.set(key, {
        key,
        anchorId: `record-${safeAnchor(anchorSource)}`,
        projectRef,
        project,
        retrospectives: [],
        plans: [],
        latestTimestamp: 0,
        pinWeight: Number.isFinite(project?.data?.pinWeight) ? project.data.pinWeight : Number.POSITIVE_INFINITY
      });
    }
    const thread = threads.get(key);
    thread[phase].push(entry);
    thread.latestTimestamp = Math.max(thread.latestTimestamp, entryDate(entry));
  });

  return [...threads.values()]
    .map((thread) => {
      thread.retrospectives.sort(compareRecordDate);
      thread.plans.sort(compareRecordDate);
      const fallbackEntry = thread.retrospectives[0] || thread.plans[0] || null;
      return {
        ...thread,
        fallbackEntry,
        title: thread.project?.data?.title || fallbackEntry?.data?.title || "Untitled record",
        hasRetrospective: thread.retrospectives.length > 0,
        hasPlan: thread.plans.length > 0,
        isComplete: thread.retrospectives.length > 0 && thread.plans.length > 0
      };
    })
    .sort((a, b) => {
      if (a.pinWeight !== b.pinWeight) return a.pinWeight - b.pinWeight;
      if (a.latestTimestamp !== b.latestTimestamp) return b.latestTimestamp - a.latestTimestamp;
      return a.title.localeCompare(b.title);
    });
}

export function normalizeRecordView(view) {
  return RECORD_VIEWS.includes(view) ? view : "all";
}

export function recordThreadMatchesView(thread, view = "all") {
  const normalized = normalizeRecordView(view);
  if (normalized === "retrospectives") return thread.hasRetrospective;
  if (normalized === "plans") return thread.hasPlan;
  if (normalized === "complete") return thread.isComplete;
  return true;
}

export function visibleRecordPhases(thread, view = "all") {
  const normalized = normalizeRecordView(view);
  return {
    retrospectives: recordThreadMatchesView(thread, normalized) && normalized !== "plans",
    plans: recordThreadMatchesView(thread, normalized) && normalized !== "retrospectives"
  };
}

export function recordThreadStats(threads = []) {
  return {
    threads: threads.length,
    retrospectives: threads.reduce((count, thread) => count + thread.retrospectives.length, 0),
    plans: threads.reduce((count, thread) => count + thread.plans.length, 0),
    complete: threads.filter((thread) => thread.isComplete).length
  };
}

export function recordViewCounts(threads = []) {
  return Object.fromEntries(RECORD_VIEWS.map((view) => [
    view,
    threads.filter((thread) => recordThreadMatchesView(thread, view)).length
  ]));
}
