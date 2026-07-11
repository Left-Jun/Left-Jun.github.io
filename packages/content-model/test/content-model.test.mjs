import assert from "node:assert/strict";
import test from "node:test";

import {
  assetUrl,
  entryUrl,
  languageFromPath,
  markdownToHtml,
  parseMarkdown,
  stringifyMarkdown,
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
