import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const componentNames = [
  "PostsPage.astro",
  "PostColumnPage.astro",
  "PostEntryCard.astro",
  "PostColumnCard.astro",
  "PostFilters.astro"
];

const sources = Object.fromEntries(await Promise.all(componentNames.map(async (name) => [
  name,
  await fs.readFile(new URL(`../src/components/${name}`, import.meta.url), "utf8")
])));

test("posts typography uses fixed pixel tiers at the site root scale", () => {
  for (const [name, source] of Object.entries(sources)) {
    assert.doesNotMatch(source, /[0-9.]+rem\b/, `${name} must not inherit conventional-rem sizing from the 62.5% root`);
    assert.doesNotMatch(source, /font-size:\s*clamp\(/, `${name} must not scale type continuously with viewport width`);
  }

  assert.match(sources["PostsPage.astro"], /\.posts-page-header h1 \{[\s\S]*?font-size: 40px/);
  assert.match(sources["PostsPage.astro"], /@media \(min-width: 768px\) and \(max-width: 1180px\)[\s\S]*?\.posts-page-header h1[\s\S]*?font-size: 34px/);
  assert.match(sources["PostsPage.astro"], /@media \(max-width: 767px\)[\s\S]*?\.posts-page-header h1[\s\S]*?font-size: 28px/);
  assert.match(sources["PostEntryCard.astro"], /\.post-entry-card--spotlight h3 \{[\s\S]*?font-size: 32px/);
  assert.match(sources["PostEntryCard.astro"], /\.post-entry-card__labels a,[\s\S]*?min-height: 28px/);
});

test("mobile post filters retain usable controls", () => {
  const source = sources["PostFilters.astro"];
  assert.match(source, /\.posts-filter-chip \{[\s\S]*?min-height: 40px/);
  assert.match(source, /@media \(max-width: 767px\)[\s\S]*?\.posts-inline-filter-group[\s\S]*?min-height: 40px/);
});
