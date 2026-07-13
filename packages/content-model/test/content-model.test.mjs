import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assetUrl,
  entryUrl,
  isSafeProjectLink,
  isStablePortfolioType,
  languageFromPath,
  markdownToHtml,
  parseMarkdown,
  stringifyMarkdown,
  validateContentRoot,
  validateFrontMatter
} from "../src/index.js";

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

test("update front matter requires a dated update kind", () => {
  assert.throws(() => validateFrontMatter({
    title: "Milestone",
    date: "2026-07-13",
    description: "A public milestone.",
    relatedPages: []
  }, { section: "updates" }), /kind/i);
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
