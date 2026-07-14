import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const source = await fs.readFile(new URL("../src/components/AboutPage.astro", import.meta.url), "utf8");

test("about page keeps its narrative content and static project posters data-driven", () => {
  assert.match(source, /interface Props \{\s*entry: SiteEntry;/);
  assert.match(source, /getEntries\("projects", \{ lang \}\)/);
  assert.match(source, /Number\.isFinite\(project\.data\.homeHeroWeight\)/);
  assert.match(source, /\.slice\(0, 3\)/);
  assert.match(source, /<ResponsiveImage/);
  assert.doesNotMatch(source, /<video|CoverMedia/);
  assert.match(source, /set:html=\{introductionHtml\}/);
  assert.match(source, /set:html=\{sectionsHtml\}/);
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
