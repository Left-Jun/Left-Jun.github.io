import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const [source, asherahZh, asherahEn] = await Promise.all([
  fs.readFile(new URL("../src/components/AboutPage.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/projects/ashe-lament/index.md", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/projects/ashe-lament/index.en.md", import.meta.url), "utf8")
]);

test("about page keeps its narrative content and representative media data-driven", () => {
  assert.match(source, /interface Props \{\s*entry: SiteEntry;/);
  assert.match(source, /getEntries\("projects", \{ lang \}\)/);
  assert.match(source, /Number\.isFinite\(project\.data\.homeHeroWeight\)/);
  assert.match(source, /\.slice\(0, 3\)/);
  assert.match(source, /import CoverMedia from "\.\/CoverMedia\.astro"/);
  assert.match(source, /<CoverMedia/);
  assert.match(source, /videoSrc=\{videoUrl\}/);
  assert.match(source, /project\.data\.coverVideo/);
  assert.doesNotMatch(source, /<ResponsiveImage/);
  assert.match(source, /set:html=\{introductionHtml\}/);
  assert.match(source, /set:html=\{sectionsHtml\}/);
});

test("about representative work uses equal fill media while keeping horizontal browsing", () => {
  assert.match(source, /\.about-story__media-rail \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(source, /\.about-story__project-media \{[\s\S]*?aspect-ratio: 16 \/ 9/);
  assert.match(source, /\.about-story__project-media :global\(\.about-story__project-image\) \{[\s\S]*?object-fit: cover/);
  assert.match(source, /style=\{`object-position: \$\{project\.data\.imagePosition \|\| "center"\};`\}/);
  assert.match(source, /@media \(min-width: 768px\) and \(max-width: 1000px\)[\s\S]*?\.about-story__media-rail \{[\s\S]*?display: flex;[\s\S]*?overflow-x: auto/);
  assert.match(source, /@media \(max-width: 767px\)[\s\S]*?\.about-story__media-rail \{[\s\S]*?display: flex;[\s\S]*?overflow-x: auto/);
});

test("about representative work restores Asherah's bilingual looping cover source", () => {
  assert.match(asherahZh, /^coverVideo: "cover\.mp4"$/m);
  assert.match(asherahEn, /^coverVideo: "cover\.mp4"$/m);
  assert.match(source, /project\.data\.coverVideo/);
  assert.match(source, /videoSrc=\{videoUrl\}/);
});

test("about page owns a bilingual section index and flat contact call to action", () => {
  assert.match(source, /entry\.toc \|\| \[\]/);
  assert.match(source, /class="about-story__index"/);
  assert.match(source, /getEntryBySlug\("pages", "contact", lang\)/);
  assert.match(source, /resolvedConfig\.contact\?\.email/);
  assert.match(source, /class="about-story__contact"/);
  assert.doesNotMatch(source, /about-contact-card/);
});

test("about typography and controls respect the site scale", () => {
  assert.doesNotMatch(source, /[0-9.]+rem\b/);
  assert.doesNotMatch(source, /font-size:\s*clamp\(/);
  assert.match(source, /\.about-story__sections :global\(p\),[\s\S]*?font-size: 15px/);
  assert.match(source, /\.about-story__contact-action \{[\s\S]*?min-height: 44px/);
  assert.match(source, /border-radius: 16px/);
  assert.match(source, /border-radius: 10px/);
});
