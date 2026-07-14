import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const layout = fs.readFileSync(path.join(root, "src/components/ProjectLayout.astro"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/styles/projects-refresh.css"), "utf8");
const zhRoute = fs.readFileSync(path.join(root, "src/pages/projects/[slug].astro"), "utf8");
const enRoute = fs.readFileSync(path.join(root, "src/pages/en/projects/[slug].astro"), "utf8");

test("project routes use the dedicated project layout", () => {
  assert.match(zhRoute, /ProjectLayout/);
  assert.match(enRoute, /ProjectLayout/);
  assert.doesNotMatch(zhRoute, /ArticleLayout/);
  assert.doesNotMatch(enRoute, /ArticleLayout/);
});

test("project hero is media-first and exposes the first evidence link as primary CTA", () => {
  assert.ok(layout.indexOf("project-case__media") < layout.indexOf("project-case__intro"));
  assert.match(layout, /const primaryLink = projectLinks\[0\]/);
  assert.match(layout, /project-case__primary-action/);
  assert.match(styles, /\.project-case__media\s*\{[\s\S]*?aspect-ratio:\s*25\s*\/\s*12/);
  assert.match(styles, /\.project-case__media \.project-case__cover\s*\{[\s\S]*?object-fit:\s*cover/);
});

test("project facts omit the result while the narrative summary includes it", () => {
  const factBlock = layout.match(/const factItems = \[([\s\S]*?)\]\.filter/)?.[1] || "";
  assert.doesNotMatch(factBlock, /facts\.result/);
  assert.match(layout, /project-case__result/);
  assert.match(layout, /facts\.result/);
});

test("body media stays natural and only the table of contents list scrolls", () => {
  assert.match(styles, /\.project-case__content img,[\s\S]*?height:\s*auto/);
  assert.match(styles, /\.project-case__content img\s*\{[\s\S]*?object-fit:\s*contain/);
  assert.match(styles, /\.project-case-sidebar\s*\{[\s\S]*?overflow:\s*visible/);
  assert.match(styles, /\.widget--toc \.toc-nav\s*\{[\s\S]*?overflow-y:\s*auto/);
  assert.match(styles, /\.widget--toc \.widget-title\s*\{[\s\S]*?flex:\s*0 0 auto/);
});

test("mobile keeps the media first, hides only the redundant kicker, and keeps the title compact", () => {
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*?\.project-case__media\s*\{[\s\S]*?aspect-ratio:\s*2\s*\/\s*1/);
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*?\.project-case__kicker\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*?\.project-case__intro h1\s*\{[\s\S]*?font-size:\s*27px/);
});
