import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProjectRecordThreads,
  normalizeRecordView,
  recordThreadMatchesView,
  recordThreadStats,
  recordViewCounts,
  visibleRecordPhases
} from "../src/lib/project-records.js";

function entry(section, slug, date, data = {}) {
  return {
    ref: `${section}/${slug}`,
    slug,
    section,
    url: `/${section}/${slug}/`,
    data: {
      title: slug,
      date: new Date(date),
      relatedPages: [],
      categories: [],
      tags: [],
      roleTags: [],
      ...data
    }
  };
}

test("record threads pair phases through project references and preserve unlinked records", () => {
  const project = entry("projects", "game", "2026-01-01T00:00:00Z", { pinWeight: 10 });
  const retrospective = entry("retrospectives", "game-retro", "2026-03-01T00:00:00Z", {
    relatedPages: [project.ref, "plans/game-plan"]
  });
  const plan = entry("plans", "game-plan", "2026-02-01T00:00:00Z", {
    relatedPages: [project.ref, retrospective.ref]
  });
  const unlinked = entry("retrospectives", "standalone", "2026-04-01T00:00:00Z");

  const threads = buildProjectRecordThreads({ projects: [project], retrospectives: [retrospective, unlinked], plans: [plan] });
  assert.equal(threads.length, 2);
  assert.equal(threads[0].project.ref, project.ref);
  assert.deepEqual(threads[0].retrospectives.map((item) => item.ref), [retrospective.ref]);
  assert.deepEqual(threads[0].plans.map((item) => item.ref), [plan.ref]);
  assert.equal(threads[0].isComplete, true);
  assert.equal(threads[1].project, null);
  assert.equal(threads[1].fallbackEntry.ref, unlinked.ref);
});

test("record threads sort by project pin weight then latest record date", () => {
  const projectA = entry("projects", "a", "2026-01-01T00:00:00Z", { pinWeight: 20 });
  const projectB = entry("projects", "b", "2026-01-01T00:00:00Z", { pinWeight: 10 });
  const projectC = entry("projects", "c", "2026-01-01T00:00:00Z");
  const records = [
    entry("retrospectives", "a-retro", "2026-05-03T00:00:00Z", { relatedPages: [projectA.ref] }),
    entry("retrospectives", "b-retro", "2026-05-01T00:00:00Z", { relatedPages: [projectB.ref] }),
    entry("retrospectives", "c-retro", "2026-05-04T00:00:00Z", { relatedPages: [projectC.ref] }),
    entry("retrospectives", "unlinked", "2026-05-05T00:00:00Z")
  ];

  const threads = buildProjectRecordThreads({ projects: [projectA, projectB, projectC], retrospectives: records });
  assert.deepEqual(threads.map((thread) => thread.project?.slug || thread.fallbackEntry.slug), ["b", "a", "unlinked", "c"]);
});

test("record views keep phase visibility and counts consistent", () => {
  const complete = {
    hasRetrospective: true,
    hasPlan: true,
    isComplete: true,
    retrospectives: [{}, {}],
    plans: [{}]
  };
  const retrospectiveOnly = {
    hasRetrospective: true,
    hasPlan: false,
    isComplete: false,
    retrospectives: [{}],
    plans: []
  };
  const threads = [complete, retrospectiveOnly];

  assert.equal(normalizeRecordView("unknown"), "all");
  assert.equal(recordThreadMatchesView(retrospectiveOnly, "plans"), false);
  assert.deepEqual(visibleRecordPhases(complete, "plans"), { retrospectives: false, plans: true });
  assert.deepEqual(visibleRecordPhases(complete, "complete"), { retrospectives: true, plans: true });
  assert.deepEqual(recordThreadStats(threads), { threads: 2, retrospectives: 3, plans: 1, complete: 1 });
  assert.deepEqual(recordViewCounts(threads), { all: 2, retrospectives: 2, plans: 1, complete: 1 });
});
