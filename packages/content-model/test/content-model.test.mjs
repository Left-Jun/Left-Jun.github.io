import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  PROJECT_LINK_KINDS,
  VISUAL_THEME_IDS,
  assetUrl,
  entryUrl,
  isKnownPostColumnId,
  isKnownProjectLinkKind,
  isKnownVisualTheme,
  isSafeProjectLink,
  isStableColumnId,
  isStablePortfolioType,
  languageFromPath,
  markdownToHtml,
  parseMarkdown,
  stringifyMarkdown,
  validateContentRoot,
  validateFrontMatter
} from "../src/index.js";

test("visual themes use the shared explicit registry", () => {
  assert.deepEqual(VISUAL_THEME_IDS, ["emotion-mask"]);
  assert.equal(isKnownVisualTheme("emotion-mask"), true);
  assert.equal(isKnownVisualTheme("Emotion Mask"), false);

  const themed = validateFrontMatter({
    title: "Emotion Mask",
    portfolioType: "game",
    visualTheme: "emotion-mask"
  }, { section: "projects" });
  assert.equal(themed.visualTheme, "emotion-mask");

  assert.throws(() => validateFrontMatter({
    title: "Unknown theme",
    visualTheme: "emotion-mask-deluxe"
  }, { section: "posts" }), /visualTheme/i);
});

test("visual themes must stay aligned across translations", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-visual-theme-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const projectDir = path.join(root, "projects", "emotion-mask");
  await fs.mkdir(projectDir, { recursive: true });

  const frontMatter = {
    title: "Emotion Mask",
    slug: "emotion-mask",
    portfolioType: "game",
    visualTheme: "emotion-mask"
  };
  await fs.writeFile(path.join(projectDir, "index.md"), stringifyMarkdown(frontMatter, ""));
  await fs.writeFile(path.join(projectDir, "index.en.md"), stringifyMarkdown(frontMatter, ""));
  assert.equal((await validateContentRoot(root)).ok, true);

  const withoutTheme = { ...frontMatter };
  delete withoutTheme.visualTheme;
  await fs.writeFile(path.join(projectDir, "index.en.md"), stringifyMarkdown(withoutTheme, ""));
  const drifted = await validateContentRoot(root);
  assert.equal(drifted.ok, false);
  assert.match(drifted.errors.map((error) => error.message).join("\n"), /metadata mismatch.*visualTheme/i);
});

test("front matter round-trips through the maintained parser", () => {
  const source = "---\ntitle: Example\ntags:\n  - Astro\n---\n\nHello world.\n";
  const parsed = parseMarkdown(source);

  assert.equal(parsed.frontMatter.title, "Example");
  assert.deepEqual(parsed.frontMatter.tags, ["Astro"]);
  assert.match(parsed.body, /Hello world\./);

  const reparsed = parseMarkdown(stringifyMarkdown(parsed.frontMatter, parsed.body));
  assert.equal(reparsed.frontMatter.title, "Example");
  assert.deepEqual(reparsed.frontMatter.tags, ["Astro"]);
});

test("front matter validation rejects entries without a title", () => {
  assert.throws(() => validateFrontMatter({ tags: ["test"] }), /title/i);
});

test("cover videos require an image poster", () => {
  assert.throws(() => validateFrontMatter({
    title: "Video cover",
    coverVideo: "cover.mp4",
    portfolioType: "game"
  }, { section: "projects" }), /coverVideo requires an image poster/i);

  assert.doesNotThrow(() => validateFrontMatter({
    title: "Video cover",
    image: "cover.webp",
    coverVideo: "cover.mp4",
    portfolioType: "game"
  }, { section: "projects" }));
});

test("update front matter requires a dated update kind", () => {
  assert.throws(() => validateFrontMatter({
    title: "Milestone",
    date: "2026-07-13",
    description: "A public milestone.",
    relatedPages: []
  }, { section: "updates" }), /kind/i);
});

test("update front matter accepts recruitment evidence and featured metadata", () => {
  const update = validateFrontMatter({
    title: "Milestone",
    date: "2026-07-13",
    description: "A public milestone.",
    kind: "training",
    relatedPages: [],
    contribution: "Implemented the gameplay loop.",
    result: "Delivered a playable build.",
    featured: true,
    featuredWeight: 20,
    projectLinks: [{ label: "Demo", url: "https://example.com/demo", icon: "display" }]
  }, { section: "updates" });

  assert.equal(update.contribution, "Implemented the gameplay loop.");
  assert.equal(update.result, "Delivered a playable build.");
  assert.equal(update.featured, true);
  assert.equal(update.featuredWeight, 20);
  assert.deepEqual(update.projectLinks, [
    { label: "Demo", url: "https://example.com/demo", icon: "display" }
  ]);
});

test("post front matter accepts explicit columns and featured metadata", () => {
  const post = validateFrontMatter({
    title: "Technical note",
    columnIds: ["technical"],
    featured: true,
    featuredWeight: 4
  }, { section: "posts" });

  assert.deepEqual(post.columnIds, ["technical"]);
  assert.equal(post.featured, true);
  assert.equal(post.featuredWeight, 4);
  assert.equal(isStableColumnId("gameplay-notes"), true);
  assert.equal(isStableColumnId("Gameplay Notes"), false);
  assert.equal(isKnownPostColumnId("technical"), true);
  assert.equal(isKnownPostColumnId("gameplay-notes"), false);
  assert.throws(() => validateFrontMatter({
    title: "Invalid column",
    columnIds: ["Technical"]
  }, { section: "posts" }), /column IDs.*kebab-case/i);
  assert.throws(() => validateFrontMatter({
    title: "Unknown column",
    columnIds: ["gameplay-notes"]
  }, { section: "posts" }), /shared registry/i);
  assert.throws(() => validateFrontMatter({
    title: "Duplicate column",
    columnIds: ["technical", "technical"]
  }, { section: "posts" }), /must not contain duplicates/i);
});

test("project links reject executable and non-web URL schemes", () => {
  for (const url of ["javascript:alert(1)", "//evil.example/path", "/\\evil.example/path", "https://"]) {
    assert.equal(isSafeProjectLink(url), false);
    assert.throws(() => validateFrontMatter({
      title: "Unsafe project",
      portfolioType: "game",
      projectLinks: [{ label: "Run", url }]
    }, { section: "projects" }), /Project links must use/i);
  }

  for (const url of ["/content-assets/report.pdf", "https://example.com/build", "http://example.com/demo"]) {
    assert.equal(isSafeProjectLink(url), true);
  }
});

test("project link kinds are optional and restricted to the shared registry", () => {
  assert.deepEqual(PROJECT_LINK_KINDS, [
    "playable",
    "store",
    "video",
    "source",
    "report",
    "site",
    "evidence"
  ]);

  assert.doesNotThrow(() => validateFrontMatter({
    title: "Legacy project link",
    portfolioType: "game",
    projectLinks: [{ label: "Demo", url: "https://example.com/demo" }]
  }, { section: "projects" }));

  for (const kind of PROJECT_LINK_KINDS) {
    assert.equal(isKnownProjectLinkKind(kind), true);
    assert.doesNotThrow(() => validateFrontMatter({
      title: `Project link ${kind}`,
      portfolioType: "game",
      projectLinks: [{ label: "Evidence", url: "https://example.com/evidence", kind }]
    }, { section: "projects" }));
  }

  assert.equal(isKnownProjectLinkKind("download"), false);
  assert.throws(() => validateFrontMatter({
    title: "Invalid project link kind",
    portfolioType: "game",
    projectLinks: [{ label: "Download", url: "https://example.com/build", kind: "download" }]
  }, { section: "projects" }), /projectLinks\.0\.kind/i);
});

test("project portfolio types use stable lowercase tokens", () => {
  assert.equal(isStablePortfolioType("game-client"), true);
  assert.equal(isStablePortfolioType("game client"), false);
  assert.equal(isStablePortfolioType("Game"), false);
  assert.throws(() => validateFrontMatter({
    title: "Unstable type",
    portfolioType: "game client"
  }, { section: "projects" }), /portfolio type/i);
});

test("content validation requires paired entries and paired section indexes", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-content-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await fs.mkdir(path.join(root, "updates", "milestone"), { recursive: true });
  await fs.writeFile(path.join(root, "updates", "_index.md"), stringifyMarkdown({
    title: "动态",
    slug: "updates"
  }, ""));
  await fs.writeFile(path.join(root, "updates", "_index.en.md"), stringifyMarkdown({
    title: "Updates",
    slug: "updates"
  }, ""));

  const update = {
    title: "里程碑",
    date: "2026-07-13",
    description: "阶段记录。",
    kind: "project",
    relatedPages: [],
    slug: "milestone"
  };
  await fs.writeFile(path.join(root, "updates", "milestone", "index.md"), stringifyMarkdown(update, ""));

  const missing = await validateContentRoot(root);
  assert.equal(missing.ok, false);
  assert.deepEqual(missing.errors.map((error) => error.message), [
    "Missing en translation for updates/milestone"
  ]);

  await fs.writeFile(path.join(root, "updates", "milestone", "index.en.md"), stringifyMarkdown({
    ...update,
    title: "Milestone",
    description: "A public milestone.",
    slug: "different-slug"
  }, ""));
  const mismatched = await validateContentRoot(root);
  assert.equal(mismatched.ok, false);
  assert.match(mismatched.errors[0].message, /Translation slug mismatch/);

  await fs.writeFile(path.join(root, "updates", "milestone", "index.en.md"), stringifyMarkdown({
    ...update,
    title: "Milestone",
    description: "A public milestone."
  }, ""));
  const paired = await validateContentRoot(root);
  assert.equal(paired.ok, true);
});

test("content validation rejects translation metadata drift and duplicate public routes", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-content-invariants-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "updates", "milestone"), { recursive: true });
  await fs.writeFile(path.join(root, "updates", "_index.md"), stringifyMarkdown({ title: "动态", slug: "updates" }, ""));
  await fs.writeFile(path.join(root, "updates", "_index.en.md"), stringifyMarkdown({ title: "Updates", slug: "updates" }, ""));

  const update = {
    title: "里程碑",
    date: "2026-07-13",
    description: "阶段记录。",
    kind: "project",
    relatedPages: [],
    slug: "milestone",
    status: "completed"
  };
  await fs.writeFile(path.join(root, "updates", "milestone", "index.md"), stringifyMarkdown(update, ""));
  await fs.writeFile(path.join(root, "updates", "milestone", "index.en.md"), stringifyMarkdown({
    ...update,
    title: "Milestone",
    description: "A public milestone.",
    status: "in-progress"
  }, ""));

  const drifted = await validateContentRoot(root);
  assert.equal(drifted.ok, false);
  assert.match(drifted.errors.map((error) => error.message).join("\n"), /metadata mismatch.*status/i);

  await fs.writeFile(path.join(root, "updates", "milestone", "index.en.md"), stringifyMarkdown({
    ...update,
    title: "Milestone",
    description: "A public milestone.",
    draft: true
  }, ""));
  const draftDrifted = await validateContentRoot(root);
  assert.equal(draftDrifted.ok, false);
  assert.match(draftDrifted.errors.map((error) => error.message).join("\n"), /metadata mismatch.*draft/i);

  await fs.writeFile(path.join(root, "updates", "milestone", "index.en.md"), stringifyMarkdown({
    ...update,
    title: "Milestone",
    description: "A public milestone."
  }, ""));
  await fs.mkdir(path.join(root, "updates", "duplicate"), { recursive: true });
  await fs.writeFile(path.join(root, "updates", "duplicate", "index.md"), stringifyMarkdown({
    ...update,
    title: "重复路由"
  }, ""));
  await fs.writeFile(path.join(root, "updates", "duplicate", "index.en.md"), stringifyMarkdown({
    ...update,
    title: "Duplicate route",
    description: "A duplicate route."
  }, ""));

  const duplicated = await validateContentRoot(root);
  assert.equal(duplicated.ok, false);
  assert.match(duplicated.errors.map((error) => error.message).join("\n"), /Duplicate public route/);
});

test("update translations align featured metadata and evidence structure", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-update-evidence-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const updateDir = path.join(root, "updates", "milestone");
  await fs.mkdir(updateDir, { recursive: true });

  const zh = {
    title: "训练营里程碑",
    slug: "milestone",
    date: "2026-07-13",
    description: "完成阶段训练。",
    kind: "training",
    relatedPages: [],
    contribution: "实现联机玩法循环。",
    result: "交付可玩版本。",
    featured: true,
    featuredWeight: 10,
    projectLinks: [
      { label: "演示", url: "https://example.com/demo", icon: "display" },
      { label: "报告", url: "/content-assets/report.pdf", icon: "link" }
    ]
  };
  const en = {
    ...zh,
    title: "Training milestone",
    description: "Completed a training milestone.",
    contribution: "Implemented the multiplayer gameplay loop.",
    result: "Delivered a playable build.",
    projectLinks: [
      { label: "Demo", url: "https://example.com/demo", icon: "display" },
      { label: "Report", url: "/content-assets/report.pdf", icon: "link" }
    ]
  };
  const zhPath = path.join(updateDir, "index.md");
  const enPath = path.join(updateDir, "index.en.md");
  await fs.writeFile(zhPath, stringifyMarkdown(zh, ""));

  async function validateEnglish(frontMatter) {
    await fs.writeFile(enPath, stringifyMarkdown(frontMatter, ""));
    return validateContentRoot(root);
  }

  assert.equal((await validateEnglish(en)).ok, true);

  for (const [key, value] of [
    ["kind", "award"],
    ["featured", false],
    ["featuredWeight", 30]
  ]) {
    const drifted = await validateEnglish({ ...en, [key]: value });
    assert.equal(drifted.ok, false);
    assert.match(drifted.errors.map((error) => error.message).join("\n"), new RegExp(`metadata mismatch.*${key}`, "i"));
  }

  for (const key of ["contribution", "result"]) {
    const missingField = { ...en };
    delete missingField[key];
    const drifted = await validateEnglish(missingField);
    assert.equal(drifted.ok, false);
    assert.match(drifted.errors.map((error) => error.message).join("\n"), new RegExp(`field presence mismatch.*${key}`, "i"));
  }

  const missingLink = await validateEnglish({ ...en, projectLinks: en.projectLinks.slice(0, 1) });
  assert.equal(missingLink.ok, false);
  assert.match(missingLink.errors.map((error) => error.message).join("\n"), /evidence link count mismatch.*projectLinks/i);

  const changedUrl = await validateEnglish({
    ...en,
    projectLinks: [
      { ...en.projectLinks[0], url: "https://example.com/other" },
      en.projectLinks[1]
    ]
  });
  assert.equal(changedUrl.ok, false);
  assert.match(changedUrl.errors.map((error) => error.message).join("\n"), /evidence link mismatch.*projectLinks\[0\]\.url/i);

  const changedIcon = await validateEnglish({
    ...en,
    projectLinks: [
      en.projectLinks[0],
      { ...en.projectLinks[1], icon: "download" }
    ]
  });
  assert.equal(changedIcon.ok, false);
  assert.match(changedIcon.errors.map((error) => error.message).join("\n"), /evidence link mismatch.*projectLinks\[1\]\.icon/i);
});

test("project translations align link structure while labels may be translated", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-project-links-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const projectDir = path.join(root, "projects", "project-evidence");
  await fs.mkdir(projectDir, { recursive: true });

  const zh = {
    title: "Project evidence",
    slug: "project-evidence",
    portfolioType: "game",
    projectLinks: [
      { label: "Playable build", url: "https://example.com/build", icon: "display", kind: "playable" },
      { label: "Source code", url: "https://example.com/source", icon: "brand-github", kind: "source" }
    ]
  };
  const en = {
    ...zh,
    title: "Project evidence in English",
    projectLinks: [
      { ...zh.projectLinks[0], label: "Download build" },
      { ...zh.projectLinks[1], label: "Repository" }
    ]
  };
  await fs.writeFile(path.join(projectDir, "index.md"), stringifyMarkdown(zh, ""));
  const enPath = path.join(projectDir, "index.en.md");

  async function validateEnglish(frontMatter) {
    await fs.writeFile(enPath, stringifyMarkdown(frontMatter, ""));
    return validateContentRoot(root);
  }

  assert.equal((await validateEnglish(en)).ok, true);

  const missingLink = await validateEnglish({ ...en, projectLinks: en.projectLinks.slice(0, 1) });
  assert.equal(missingLink.ok, false);
  assert.match(missingLink.errors.map((error) => error.message).join("\n"), /evidence link count mismatch.*projectLinks/i);

  for (const [key, value] of [
    ["url", "https://example.com/other"],
    ["icon", "link"],
    ["kind", "evidence"]
  ]) {
    const projectLinks = en.projectLinks.map((link, index) => (
      index === 0 ? { ...link, [key]: value } : link
    ));
    const drifted = await validateEnglish({ ...en, projectLinks });
    assert.equal(drifted.ok, false);
    assert.match(
      drifted.errors.map((error) => error.message).join("\n"),
      new RegExp(`evidence link mismatch.*projectLinks\\[0\\]\\.${key}`, "i")
    );
  }
});

test("post translations align column and featured metadata", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-post-columns-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const postDir = path.join(root, "posts", "technical-note");
  await fs.mkdir(postDir, { recursive: true });

  const zh = {
    title: "技术笔记",
    slug: "technical-note",
    date: "2026-07-14",
    columnIds: ["technical"],
    featured: true,
    featuredWeight: 3
  };
  const en = { ...zh, title: "Technical note" };
  await fs.writeFile(path.join(postDir, "index.md"), stringifyMarkdown(zh, ""));
  const enPath = path.join(postDir, "index.en.md");

  async function validateEnglish(frontMatter) {
    await fs.writeFile(enPath, stringifyMarkdown(frontMatter, ""));
    return validateContentRoot(root);
  }

  assert.equal((await validateEnglish(en)).ok, true);
  for (const [key, value] of [
    ["columnIds", []],
    ["featured", false],
    ["featuredWeight", 8]
  ]) {
    const result = await validateEnglish({ ...en, [key]: value });
    assert.equal(result.ok, false);
    assert.match(result.errors.map((error) => error.message).join("\n"), new RegExp(`metadata mismatch.*${key}`, "i"));
  }
});

test("content validation keeps bilingual cover video configuration in sync", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-content-cover-video-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "posts", "video-cover"), { recursive: true });

  const cover = {
    title: "Video cover",
    slug: "video-cover",
    image: "cover.webp",
    coverVideo: "cover.mp4"
  };
  await fs.writeFile(path.join(root, "posts", "video-cover", "index.md"), stringifyMarkdown(cover, ""));
  await fs.writeFile(path.join(root, "posts", "video-cover", "index.en.md"), stringifyMarkdown({
    ...cover,
    title: "Video cover in English"
  }, ""));

  const paired = await validateContentRoot(root);
  assert.equal(paired.ok, true);

  await fs.writeFile(path.join(root, "posts", "video-cover", "index.en.md"), stringifyMarkdown({
    ...cover,
    title: "Video cover in English",
    coverVideo: ""
  }, ""));
  const missing = await validateContentRoot(root);
  assert.equal(missing.ok, false);
  assert.match(missing.errors.map((error) => error.message).join("\n"), /metadata mismatch.*coverVideo/i);

  await fs.writeFile(path.join(root, "posts", "video-cover", "index.en.md"), stringifyMarkdown({
    ...cover,
    title: "Video cover in English",
    coverVideo: "alternate-cover.mp4"
  }, ""));
  const mismatched = await validateContentRoot(root);
  assert.equal(mismatched.ok, false);
  assert.match(mismatched.errors.map((error) => error.message).join("\n"), /metadata mismatch.*coverVideo/i);
});

test("content validation compares final public URLs against section routes", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-content-public-routes-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, "pages"), { recursive: true });

  await fs.writeFile(path.join(root, "pages", "projects.md"), stringifyMarkdown({
    title: "项目入口",
    slug: "projects"
  }, ""));
  await fs.writeFile(path.join(root, "pages", "projects.en.md"), stringifyMarkdown({
    title: "Projects entry",
    slug: "projects"
  }, ""));
  await fs.writeFile(path.join(root, "pages", "en.md"), stringifyMarkdown({
    title: "English home collision",
    slug: "en"
  }, ""));
  await fs.writeFile(path.join(root, "pages", "en.en.md"), stringifyMarkdown({
    title: "English home collision pair",
    slug: "en"
  }, ""));

  const result = await validateContentRoot(root);
  assert.equal(result.ok, false);
  const messages = result.errors.map((error) => error.message).join("\n");
  assert.match(messages, /Duplicate public route.*\/projects\//i);
  assert.match(messages, /Duplicate public route.*\/en\//i);
});

test("language and entry URLs remain stable", () => {
  assert.equal(languageFromPath("projects/example.en.md"), "en");
  assert.equal(entryUrl("projects", { id: "projects/example.en.md", data: {} }, "en"), "/en/projects/example/");
});

test("relative content assets are rewritten while external URLs are preserved", () => {
  assert.equal(assetUrl("posts", "posts/example.md", "cover.webp"), "/content-assets/posts/example/cover.webp");
  const html = markdownToHtml("![Cover](cover.webp)\n\n[External](https://example.com/file.pdf)", {
    section: "posts",
    id: "posts/example.md"
  });

  assert.match(html, /src="\/content-assets\/posts\/example\/cover\.webp"/);
  assert.match(html, /href="https:\/\/example\.com\/file\.pdf"/);
});

test("content images use responsive picture sources when a media manifest entry exists", () => {
  const source = "/content-assets/posts/example/cover.png";
  const html = markdownToHtml("![Cover](cover.png)", {
    section: "posts",
    id: "posts/example.md",
    mediaManifest: {
      [source]: {
        width: 1600,
        height: 900,
        avif: [{ src: "/cover-960.avif", width: 960 }],
        webp: [{ src: "/cover-960.webp", width: 960 }]
      }
    }
  });

  assert.match(html, /<picture class="content-responsive-image">/);
  assert.match(html, /type="image\/avif"/);
  assert.match(html, /srcset="\/cover-960\.webp 960w"/);
  assert.match(html, /width="1600"/);
  assert.match(html, /height="900"/);
});
