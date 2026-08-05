import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const files = {
  researchZh: new URL("../src/content/projects/ai-game-creation-research/index.md", import.meta.url),
  researchEn: new URL("../src/content/projects/ai-game-creation-research/index.en.md", import.meta.url),
  actionZh: new URL("../src/content/projects/action-game-ip-design/index.md", import.meta.url),
  actionEn: new URL("../src/content/projects/action-game-ip-design/index.en.md", import.meta.url),
  pmZh: new URL("../src/content/projects/ai-game-project-management/index.md", import.meta.url),
  pmEn: new URL("../src/content/projects/ai-game-project-management/index.en.md", import.meta.url),
  routeZh: new URL("../src/pages/projects/[slug].astro", import.meta.url),
  routeEn: new URL("../src/pages/en/projects/[slug].astro", import.meta.url),
  layout: new URL("../src/components/ProgramProjectLayout.astro", import.meta.url),
  folders: new URL("../src/components/ProjectAttachmentFolders.astro", import.meta.url)
};

const sources = Object.fromEntries(await Promise.all(Object.entries(files).map(async ([key, url]) => [key, await fs.readFile(url, "utf8")])));
const downloadCount = (source) => source.match(/^\s+downloadUrl:/gm)?.length || 0;

test("Guanghe routes use the compact deliverables layout", () => {
  for (const route of [sources.routeZh, sources.routeEn]) {
    assert.match(route, /ProgramProjectLayout/);
    assert.match(route, /entry\.data\.program === "guanghe-campus-co-creation"/);
  }
  assert.match(sources.layout, /ProjectAttachmentFolders/);
  assert.doesNotMatch(sources.layout, /ProjectLayout|projectFacts|set:html|CoverMedia/);
});

test("research deliverables preserve source folders and exclude raw records", () => {
  for (const source of [sources.researchZh, sources.researchEn]) {
    assert.equal(downloadCount(source), 8);
    assert.ok(source.indexOf('path: "."') < source.indexOf('path: "Codex约束文档"'));
    assert.ok(source.indexOf('path: "Codex约束文档"') < source.indexOf('path: "原始数据"'));
    assert.doesNotMatch(source, /samples-all-mixed-filtered-answers|定性访谈五样本汇总_摘要与逐字稿|样本[一二三四五]_H5-\d+_摘要与逐字稿/);
    assert.match(source, /pageCount: 29/);
  }
});

test("action and PM projects publish one and eight source files", () => {
  assert.equal(downloadCount(sources.actionZh), 1);
  assert.equal(downloadCount(sources.actionEn), 1);
  assert.equal(downloadCount(sources.pmZh), 8);
  assert.equal(downloadCount(sources.pmEn), 8);
});

test("folder view shows directory metadata and no thumbnails", () => {
  assert.match(sources.folders, /group\.path/);
  assert.match(sources.folders, /group\.attachments\.length/);
  assert.match(sources.folders, /attachment-folder__empty/);
  assert.doesNotMatch(sources.folders, /ResponsiveImage|thumbnail/);
});
