import assert from "node:assert/strict";
import test from "node:test";

import {
  applySectionMetadata,
  sectionFieldPolicy
} from "../public/content-fields.js";

test("editor labels and visibility follow the selected section", () => {
  const project = sectionFieldPolicy("projects");
  assert.equal(project.isProject, true);
  assert.equal(project.showFeatured, true);
  assert.equal(project.featuredLabel, "首页代表项目");
  assert.equal(project.linksLabel, "项目链接 JSON");
  assert.match(project.detailsHint, /playable \/ store \/ video \/ source \/ report \/ site \/ evidence/);

  const update = sectionFieldPolicy("updates");
  assert.equal(update.isUpdate, true);
  assert.equal(update.showFeatured, true);
  assert.equal(update.featuredLabel, "精选动态");
  assert.equal(update.featuredWeightLabel, "精选动态权重");
  assert.equal(update.linksLabel, "证据链接 JSON");

  const post = sectionFieldPolicy("posts");
  assert.equal(post.isProject, false);
  assert.equal(post.isUpdate, false);
  assert.equal(post.isPost, true);
  assert.equal(post.showFeatured, true);
  assert.equal(post.featuredLabel, "精选文章");
  assert.equal(post.featuredWeightLabel, "精选文章权重");
  assert.equal(post.showLinks, false);
});

test("editor writes explicit post columns and featured metadata", () => {
  const result = applySectionMetadata({
    title: "Post",
    kind: "article",
    portfolioType: "game",
    columnIds: ["stale-column"]
  }, "posts", {
    columnIds: [" technical ", "technical"],
    featured: true,
    featuredWeight: 2
  });

  assert.deepEqual(result, {
    title: "Post",
    columnIds: ["technical"],
    featured: true,
    featuredWeight: 2
  });
});

test("editor keeps existing project metadata behavior", () => {
  const result = applySectionMetadata({
    title: "Project",
    contribution: "stale update field",
    result: "stale update result",
    weight: 40
  }, "projects", {
    portfolioType: "game",
    featured: true,
    featuredWeight: 20,
    homeHeroWeight: 30,
    pinWeight: 10,
    projectFacts: { duration: "48 hours" },
    projectLinks: [{ label: "Demo", url: "https://example.com/demo", kind: "playable" }]
  });

  assert.deepEqual(result, {
    title: "Project",
    weight: 40,
    portfolioType: "game",
    featured: true,
    featuredWeight: 20,
    homeHeroWeight: 30,
    pinWeight: 10,
    projectFacts: { duration: "48 hours" },
    projectLinks: [{ label: "Demo", url: "https://example.com/demo", kind: "playable" }]
  });
});

test("editor writes update evidence and clears project-only metadata", () => {
  const result = applySectionMetadata({
    title: "Update",
    portfolioType: "game",
    homeHeroWeight: 10,
    pinWeight: 10,
    projectFacts: { duration: "48 hours" }
  }, "updates", {
    kind: "training",
    contribution: "  Implemented gameplay networking.  ",
    result: "  Delivered a playable build.  ",
    featured: true,
    featuredWeight: 5,
    projectLinks: [{ label: "Report", url: "/content-assets/report.pdf", icon: "link" }]
  });

  assert.deepEqual(result, {
    title: "Update",
    kind: "training",
    contribution: "Implemented gameplay networking.",
    result: "Delivered a playable build.",
    featured: true,
    featuredWeight: 5,
    projectLinks: [{ label: "Report", url: "/content-assets/report.pdf", icon: "link" }]
  });
});

test("editor clears project and update metadata from other sections", () => {
  const result = applySectionMetadata({
    title: "Post",
    kind: "article",
    contribution: "Contribution",
    result: "Result",
    featured: true,
    featuredWeight: 5,
    projectLinks: [{ label: "Proof", url: "https://example.com" }],
    tags: ["Astro"]
  }, "posts");

  assert.deepEqual(result, {
    title: "Post",
    tags: ["Astro"]
  });
});
