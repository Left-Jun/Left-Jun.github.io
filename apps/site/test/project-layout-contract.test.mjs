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

test("project hero is a media-first responsive split and exposes the first evidence link as primary CTA", () => {
  assert.ok(layout.indexOf("project-case__media") < layout.indexOf("project-case__intro"));
  assert.ok(layout.indexOf("project-case__intro") < layout.indexOf("project-case__result"));
  assert.ok(layout.indexOf("project-case__result") < layout.indexOf("project-case__facts"));
  assert.match(layout, /const hasHeroMedia = Boolean\(imageUrl \|\| videoUrl\)/);
  assert.match(layout, /hasHeroMedia && "has-media"/);
  assert.match(layout, /facts\.result && "has-result"/);
  assert.match(layout, /const primaryLink = projectLinks\[0\]/);
  assert.match(layout, /project-case__primary-action/);
  assert.match(layout, /project-case__status/);
  assert.match(layout, /\(max-width: 1206px\) calc\(100vw - 300px\)/);
  assert.match(layout, /\(max-width: 1286px\) calc\(52vw - 184px\)/);
  assert.match(layout, /min\(632px, calc\(58vw - 207px\)\)/);
  assert.match(layout, /620px/);
  assert.ok(layout.indexOf("project-case__facts") < layout.indexOf("project-case__supporting"));
  assert.match(styles, /\.project-case-page \.project-case\s*\{[\s\S]*?max-width:\s*1120px/);
  assert.match(styles, /\.project-case__media\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(styles, /\.project-case__media \.project-case__cover\s*\{[\s\S]*?object-fit:\s*cover/);
  assert.match(styles, /@container project-case \(min-width:\s*880px\) and \(max-width:\s*959\.98px\)[\s\S]*?\.project-case__hero\.has-media[\s\S]*?grid-template-columns:\s*minmax\(0, 52fr\) minmax\(0, 48fr\)/);
  assert.match(styles, /@container project-case \(min-width:\s*960px\)[\s\S]*?\.project-case__hero\.has-media[\s\S]*?grid-template-columns:\s*minmax\(0, 58fr\) minmax\(0, 42fr\)/);
  assert.match(styles, /@container project-case \(min-width:\s*880px\)[\s\S]*?grid-template-areas:\s*"media intro"/);
  assert.match(styles, /\.project-case__hero\.has-media \.project-case__media\s*\{\s*grid-area:\s*media/);
  assert.match(styles, /\.project-case__hero\.has-media \.project-case__intro\s*\{\s*grid-area:\s*intro/);
  assert.match(styles, /\.project-case__hero\.has-media\.has-result \.project-case__result\s*\{[\s\S]*?grid-area:\s*media[\s\S]*?margin-top:\s*calc\(56\.25% \+ 14px\)/);
  assert.doesNotMatch(styles, /"result intro"/);
});

test("project hero omits the repeated global portfolio PDF", () => {
  assert.doesNotMatch(layout, /left-jun-portfolio\.pdf/);
  assert.doesNotMatch(layout, /Portfolio PDF|作品集 PDF/);
});

test("project facts omit the result while the narrative summary includes it", () => {
  const factBlock = layout.match(/const factItems = \[([\s\S]*?)\]\.filter/)?.[1] || "";
  assert.doesNotMatch(factBlock, /facts\.result/);
  assert.doesNotMatch(factBlock, /Status|状态/);
  assert.match(layout, /project-case__result/);
  assert.match(layout, /facts\.result/);
});

test("body media stays natural and only the table of contents list scrolls", () => {
  assert.match(styles, /\.project-case__content img,[\s\S]*?height:\s*auto/);
  assert.match(styles, /\.project-case__content img\s*\{[\s\S]*?object-fit:\s*contain/);
  assert.match(styles, /\.project-case-sidebar\s*\{[\s\S]*?overflow:\s*visible/);
  assert.match(styles, /\.widget--toc \.toc-nav\s*\{[\s\S]*?overflow-y:\s*auto/);
  assert.match(styles, /\.widget--toc \.toc-nav\s*\{[\s\S]*?grid-auto-rows:\s*max-content/);
  assert.match(styles, /\.widget--toc \.toc-nav\s*\{[\s\S]*?align-content:\s*start/);
  assert.match(styles, /\.widget--toc \.widget-title\s*\{[\s\S]*?flex:\s*0 0 auto/);
});

test("mobile keeps the media first, hides only the redundant eyebrow, and keeps the title compact", () => {
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*?\.project-case__media\s*\{[\s\S]*?aspect-ratio:\s*11\s*\/\s*5/);
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*?\.project-case__eyebrow\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(max-width: 767\.98px\)[\s\S]*?\.project-case__intro h1\s*\{[\s\S]*?font-size:\s*27px/);
});
