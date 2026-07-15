import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { parseMarkdown } from "../../../packages/content-model/src/index.js";

const contentRoot = fileURLToPath(new URL("../src/content/", import.meta.url));

async function markdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(absolute);
    return entry.isFile() && entry.name.endsWith(".md") ? [absolute] : [];
  }));
  return nested.flat();
}

test("only the six explicit Emotion Mask entries use the themed surface", async () => {
  const themed = [];
  for (const absolute of await markdownFiles(contentRoot)) {
    const raw = await fs.readFile(absolute, "utf8");
    const { frontMatter } = parseMarkdown(raw);
    if (frontMatter.visualTheme) {
      themed.push(path.relative(contentRoot, absolute).replaceAll("\\", "/"));
    }
  }

  assert.deepEqual(themed.sort(), [
    "plans/emotion-mask-roadmap/index.en.md",
    "plans/emotion-mask-roadmap/index.md",
    "projects/emotion-mask/index.en.md",
    "projects/emotion-mask/index.md",
    "retrospectives/emotion-mask-retrospective/index.en.md",
    "retrospectives/emotion-mask-retrospective/index.md"
  ]);
});

test("mixed Shuguang posts and section indexes keep the default visual theme", async () => {
  const defaults = [
    "posts/shuguang-youji-roadshow/index.md",
    "posts/shuguang-youji-roadshow/index.en.md",
    "projects/_index.md",
    "projects/_index.en.md",
    "retrospectives/_index.md",
    "retrospectives/_index.en.md",
    "plans/_index.md",
    "plans/_index.en.md"
  ];

  for (const relative of defaults) {
    const raw = await fs.readFile(path.join(contentRoot, relative), "utf8");
    assert.equal(parseMarkdown(raw).frontMatter.visualTheme, undefined, relative);
  }
});
