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
const attachmentBlocks = (source) => source.match(/^\s{6}- title:[\s\S]*?(?=^\s{6}- title:|^\s{2}- title:|^tags:)/gm) || [];
const previewUrls = (source) => source.match(/^\s+previewUrl:.*$/gm) || [];

test("Guanghe routes use the password access layout", () => {
  for (const route of [sources.routeZh, sources.routeEn]) {
    assert.match(route, /ProgramProjectLayout/);
    assert.match(route, /entry\.data\.program === "guanghe-campus-co-creation"/);
  }
  assert.match(sources.layout, /GuangheAccess/);
  assert.match(sources.layout, /noindex, noarchive/);
  assert.doesNotMatch(sources.layout, /ProjectAttachmentFolders/);
});

test("localized Guanghe entries expose only public summaries", () => {
  for (const source of [sources.researchZh, sources.researchEn]) {
    assert.match(source, /access: "password"/);
    assert.doesNotMatch(source, /attachmentGroups:|projectFacts:|mentorFeedback:|previewUrl:|downloadUrl:/);
  }
});

test("all six localized projects use the shared password policy", () => {
  for (const source of [sources.researchZh, sources.researchEn, sources.actionZh, sources.actionEn, sources.pmZh, sources.pmEn]) {
    assert.match(source, /access: "password"/);
    assert.doesNotMatch(source, /content-assets\/projects\//);
  }
});

test("folder view shows directory metadata and no thumbnails", () => {
  assert.match(sources.folders, /group\.path/);
  assert.match(sources.folders, /group\.attachments\.length/);
  assert.match(sources.folders, /attachment-folder__empty/);
  assert.match(sources.folders, /group\.path === "\." \? "attachment-folder--root" : "attachment-folder--nested"/);
  assert.match(sources.folders, /\.attachment-folder--nested[\s\S]*?border-left:/);
  assert.match(sources.folders, /@media \(max-width: 767px\)[\s\S]*?\.attachment-folder--nested/);
  assert.doesNotMatch(sources.folders, /ResponsiveImage|thumbnail/);
});

test("encrypted manifest keeps project files off public front matter", async () => {
  const manifest = JSON.parse(await fs.readFile(new URL("../public/protected/guanghe/manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.algorithm, "AES-256-GCM");
  assert.equal(manifest.kdf.name, "PBKDF2");
  assert.equal(manifest.kdf.keyLength, 256);
  assert.ok(manifest.payload?.ciphertext);
  assert.ok(manifest.verifier?.ciphertext);
  assert.equal((await fs.readdir(new URL("../public/protected/guanghe/assets/", import.meta.url))).length, 28);
});
