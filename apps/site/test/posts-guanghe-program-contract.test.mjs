import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const files = {
  postsPage: new URL("../src/components/PostsPage.astro", import.meta.url),
  programFeature: new URL("../src/components/GuangheProgramFeature.astro", import.meta.url),
  postsZh: new URL("../src/pages/posts/index.astro", import.meta.url),
  postsEn: new URL("../src/pages/en/posts/index.astro", import.meta.url),
  layout: new URL("../src/components/ProgramProjectLayout.astro", import.meta.url),
  projectZh: new URL("../src/content/projects/ai-game-project-management/index.md", import.meta.url),
  projectEn: new URL("../src/content/projects/ai-game-project-management/index.en.md", import.meta.url)
};

const sources = Object.fromEntries(await Promise.all(
  Object.entries(files).map(async ([key, url]) => [key, await fs.readFile(url, "utf8")])
));

test("project details show public summary before the password gate", () => {
  const descriptionIndex = sources.layout.indexOf("entry.data.description");
  const gateIndex = sources.layout.indexOf("<GuangheAccess");

  assert.ok(descriptionIndex >= 0);
  assert.ok(gateIndex > descriptionIndex);
  assert.match(sources.layout, /noindex, noarchive/);
  assert.match(sources.layout, /program-project-page/);
  for (const source of [sources.projectZh, sources.projectEn]) {
    assert.match(source, /access: "password"/);
    assert.doesNotMatch(source, /mentorFeedback:|projectFacts:|attachmentGroups:/);
  }
});

test("Guanghe content sits between the spotlight and regular columns", () => {
  const spotlightIndex = sources.postsPage.indexOf('class="posts-block posts-spotlight"');
  const programIndex = sources.postsPage.indexOf('class="posts-block posts-guanghe-program"');
  const columnsIndex = sources.postsPage.indexOf('class="posts-block posts-columns"');
  const archiveIndex = sources.postsPage.indexOf('class="posts-block posts-archive"');

  assert.ok(spotlightIndex >= 0);
  assert.ok(programIndex > spotlightIndex);
  assert.ok(columnsIndex > programIndex);
  assert.ok(archiveIndex > columnsIndex);
  assert.match(sources.postsPage, /<strong>\{posts.length\}<\/strong>[\s\S]*?<strong>\{columns.length\}<\/strong>/);
  assert.doesNotMatch(sources.postsPage, /columns\.length\s*\+\s*programProjects/);
});

test("both article routes load the same three project slugs in explicit order", () => {
  const order = /"ai-game-project-management",\s*"ai-game-creation-research",\s*"action-game-ip-design"/;
  for (const source of [sources.postsZh, sources.postsEn]) {
    assert.match(source, order);
    assert.match(source, /getEntryBySlug\("projects", slug, lang\)/);
    assert.match(source, /programProjects=\{programProjects\}/);
  }
});

test("the feature highlights PM as the latest entry and exposes three direct links", () => {
  assert.match(sources.programFeature, /entry\.slug === "ai-game-project-management"/);
  assert.match(sources.programFeature, /formatProjectMonth\(latest\.data\.date\)/);
  assert.match(sources.programFeature, /最近收录/);
  assert.match(sources.programFeature, /Latest entry/);
  assert.match(sources.programFeature, /projects\.map\(\(entry, index\)/);
  assert.match(sources.programFeature, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(sources.programFeature, /@media \(max-width: 767px\)[\s\S]*?grid-template-columns:\s*1fr/);
});
