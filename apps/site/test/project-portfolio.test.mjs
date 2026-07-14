import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProjectTypeCounts,
  filterProjectSections,
  selectCoreProjects,
  splitProjectPortfolio
} from "../src/lib/project-portfolio.js";

function project(slug, data = {}) {
  return {
    id: `${slug}/index.md`,
    ref: `projects/${slug}`,
    slug,
    url: `/projects/${slug}/`,
    data: {
      title: slug,
      date: new Date("2026-01-01T00:00:00+08:00"),
      portfolioType: "game",
      ...data
    }
  };
}

test("core projects use featured weight order and never repeat in the archive", () => {
  const asherah = project("ashe-lament", { featured: true, featuredWeight: 10, pinWeight: 10 });
  const emotion = project("emotion-mask", { featured: true, featuredWeight: 20, pinWeight: 20 });
  const ue5 = project("ue5-coop-training-range", { featured: true, featuredWeight: 30, pinWeight: 30 });
  const smartBoat = project("smart-boat", { featured: false, pinWeight: 40, portfolioType: "embedded" });
  const projects = [smartBoat, ue5, emotion, asherah];

  assert.deepEqual(selectCoreProjects(projects).map((entry) => entry.slug), [
    "ashe-lament",
    "emotion-mask",
    "ue5-coop-training-range"
  ]);

  const split = splitProjectPortfolio(projects);
  assert.deepEqual(split.archive.map((entry) => entry.slug), ["smart-boat"]);
  assert.equal(split.archive.some((entry) => split.core.includes(entry)), false);
});

test("core selection fills missing featured slots by pin weight", () => {
  const projects = [
    project("fallback-late", { pinWeight: 50 }),
    project("featured-second", { featured: true, featuredWeight: 20, pinWeight: 20 }),
    project("fallback-first", { pinWeight: 30 }),
    project("featured-first", { featured: true, featuredWeight: 10, pinWeight: 10 })
  ];

  assert.deepEqual(selectCoreProjects(projects).map((entry) => entry.slug), [
    "featured-first",
    "featured-second",
    "fallback-first"
  ]);
});

test("project type counts keep all projects and expose the three public filters", () => {
  const projects = [
    project("game-a"),
    project("game-b"),
    project("embedded", { portfolioType: "embedded" }),
    project("web", { portfolioType: "web" }),
    project("other", { portfolioType: "other" })
  ];

  assert.deepEqual(buildProjectTypeCounts(projects), {
    all: 5,
    game: 2,
    embedded: 1,
    web: 1
  });
});

test("portfolio filtering applies to core and archive and reports empty sections", () => {
  const sections = {
    core: [
      project("core-game"),
      project("core-web", { portfolioType: "web" })
    ],
    archive: [
      project("archive-game"),
      project("archive-embedded", { portfolioType: "embedded" })
    ]
  };

  const embedded = filterProjectSections(sections, "embedded");
  assert.deepEqual(embedded.core, []);
  assert.deepEqual(embedded.archive.map((entry) => entry.slug), ["archive-embedded"]);
  assert.equal(embedded.coreVisible, false);
  assert.equal(embedded.archiveVisible, true);
  assert.equal(embedded.visibleCount, 1);

  const invalid = filterProjectSections(sections, "unsupported");
  assert.equal(invalid.filter, "all");
  assert.equal(invalid.coreVisible, true);
  assert.equal(invalid.archiveVisible, true);
  assert.equal(invalid.visibleCount, 4);
});
