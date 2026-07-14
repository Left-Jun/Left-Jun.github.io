import assert from "node:assert/strict";
import test from "node:test";

import {
  buildTimelineEntries,
  buildTimelineFilterOptions,
  groupTimelineArchiveByYear,
  groupTimelineByMonth,
  selectTimelineSpotlight,
  splitTimelineEntries,
  timelineEntryCopy
} from "../src/lib/timeline.js";

function entry(section, slug, date, data = {}) {
  return {
    id: `${slug}/index.md`,
    ref: `${section}/${slug}`,
    slug,
    section,
    lang: "zh-cn",
    url: `/${section}/${slug}/`,
    formattedDate: date.slice(0, 10),
    asset: (value) => `/content-assets/${section}/${slug}/${value}`,
    data: {
      title: slug,
      date: new Date(date),
      categories: [],
      tags: [],
      relatedPages: [],
      roleTags: [],
      ...data
    }
  };
}

test("timeline view model preserves authored kind and separates source semantics", () => {
  const project = entry("projects", "game", "2026-06-01T10:00:00+08:00");
  const update = entry("updates", "release", "2026-07-01T10:00:00+08:00", { kind: "release" });
  const retrospective = entry("retrospectives", "game-retro", "2026-05-01T10:00:00+08:00");
  const post = entry("posts", "writing", "2026-04-01T10:00:00+08:00");

  const timeline = buildTimelineEntries([project, update, retrospective, post]);
  assert.equal(project.data.kind, undefined);
  assert.equal(update.data.kind, "release");
  assert.deepEqual(timeline.map(({ source, timelineKind, filterGroup }) => ({ source, timelineKind, filterGroup })), [
    { source: "updates", timelineKind: "release", filterGroup: "publishing-writing" },
    { source: "projects", timelineKind: "project", filterGroup: "project-progress" },
    { source: "retrospectives", timelineKind: "retrospective", filterGroup: "project-progress" },
    { source: "posts", timelineKind: "article", filterGroup: "publishing-writing" }
  ]);
});

test("semantic filter groups cover update kinds and only emit groups that exist", () => {
  const timeline = buildTimelineEntries([
    entry("updates", "event", "2026-07-04T10:00:00+08:00", { kind: "event" }),
    entry("updates", "training", "2026-07-03T10:00:00+08:00", { kind: "training" }),
    entry("updates", "project", "2026-07-02T10:00:00+08:00", { kind: "project" }),
    entry("posts", "article", "2025-12-01T10:00:00+08:00")
  ]);
  const options = buildTimelineFilterOptions(timeline, "en");

  assert.deepEqual(options.groups.map(({ value, count }) => ({ value, count })), [
    { value: "project-progress", count: 1 },
    { value: "events-awards", count: 1 },
    { value: "learning-research", count: 1 },
    { value: "publishing-writing", count: 1 }
  ]);
  assert.deepEqual(options.years.map(({ value, count }) => ({ value, count })), [
    { value: "2026", count: 3 },
    { value: "2025", count: 1 }
  ]);
});

test("spotlight prefers featured weight then date and is removed from the explicit stream", () => {
  const timeline = buildTimelineEntries([
    entry("updates", "latest", "2026-07-10T10:00:00+08:00", { kind: "project" }),
    entry("updates", "featured-later", "2026-07-09T10:00:00+08:00", { kind: "award", featured: true, featuredWeight: 2 }),
    entry("updates", "featured-first", "2026-07-08T10:00:00+08:00", { kind: "release", featured: true, featuredWeight: 1 }),
    entry("projects", "archive", "2026-06-01T10:00:00+08:00")
  ]);
  const spotlight = selectTimelineSpotlight(timeline);
  const split = splitTimelineEntries(timeline, spotlight);

  assert.equal(spotlight.slug, "featured-first");
  assert.deepEqual(split.updates.map((item) => item.slug), ["latest", "featured-later"]);
  assert.deepEqual(split.archive.map((item) => item.slug), ["archive"]);
  assert.equal(split.updates.some((item) => item.ref === spotlight.ref), false);

  const withoutFeatured = buildTimelineEntries([
    entry("updates", "older", "2026-07-01T10:00:00+08:00", { kind: "project" }),
    entry("updates", "newer", "2026-07-02T10:00:00+08:00", { kind: "project" })
  ]);
  assert.equal(selectTimelineSpotlight(withoutFeatured).slug, "newer");
});

test("month grouping uses the site timezone and archive grouping remains date ordered", () => {
  const timeline = buildTimelineEntries([
    entry("updates", "local-february", "2026-01-31T16:30:00.000Z", { kind: "research" }),
    entry("updates", "january", "2026-01-10T10:00:00+08:00", { kind: "research" }),
    entry("projects", "last-year", "2025-12-10T10:00:00+08:00")
  ]);
  const months = groupTimelineByMonth(timeline.filter((item) => item.source === "updates"), "zh-cn");
  const years = groupTimelineArchiveByYear(timeline.filter((item) => item.source !== "updates"));

  assert.deepEqual(months.map((group) => group.key), ["2026-02", "2026-01"]);
  assert.match(months[0].label, /2026.*2/);
  assert.deepEqual(years.map((group) => group.year), ["2025"]);
});

test("explicit updates resolve related entries and expose source-specific copy", () => {
  const project = entry("projects", "linked-project", "2026-06-01T10:00:00+08:00");
  const update = entry("updates", "milestone", "2026-07-01T10:00:00+08:00", {
    kind: "project",
    relatedPages: [project.ref]
  });
  const timeline = buildTimelineEntries([update, project]);
  const milestone = timeline.find((item) => item.slug === "milestone");

  assert.deepEqual(milestone.timelineRelatedEntries.map((item) => item.ref), [project.ref]);
  assert.equal(timelineEntryCopy(milestone, "zh-cn").cta, "查看动态");
  assert.equal(timelineEntryCopy(timeline.find((item) => item.slug === "linked-project"), "en").cta, "View project");
});
