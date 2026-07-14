import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const componentNames = [
  "UpdatesPage.astro",
  "UpdateTimeline.astro",
  "TimelineEntryCard.astro",
  "UpdateFilters.astro",
  "UpdateLayout.astro"
];

const sources = Object.fromEntries(await Promise.all(componentNames.map(async (name) => [
  name,
  await fs.readFile(new URL(`../src/components/${name}`, import.meta.url), "utf8")
])));

test("updates typography does not use rem sizes that fall below the site scale", () => {
  for (const [name, source] of Object.entries(sources)) {
    assert.doesNotMatch(
      source,
      /font-size:\s*(?:0\.\d+|1(?:\.[0-4]\d*)?)rem\b/,
      `${name} contains a font size below 15px at the site's 62.5% root scale`
    );
  }
});

test("updates layouts use the tablet stacking breakpoint", () => {
  assert.match(sources["UpdateTimeline.astro"], /@media \(max-width: 1000px\)[\s\S]*?\.updates-month[\s\S]*?grid-template-columns: 1fr/);
  assert.match(sources["TimelineEntryCard.astro"], /@media \(max-width: 1000px\)[\s\S]*?\.timeline-entry:not\(\.timeline-entry--archive\)[\s\S]*?flex-direction: column-reverse/);
  assert.match(sources["UpdateLayout.astro"], /@media \(max-width: 1000px\)[\s\S]*?\.update-detail-summary[\s\S]*?grid-template-columns: 1fr/);
  assert.match(sources["UpdateLayout.astro"], /@media \(max-width: 1000px\)[\s\S]*?\.update-detail-evidence[\s\S]*?grid-template-columns: 1fr/);
});

test("mobile update filters preserve a usable control height and group spacing", () => {
  const source = sources["UpdateFilters.astro"];
  assert.match(source, /@media \(max-width: 767px\)[\s\S]*?\.updates-inline-filters[\s\S]*?gap: 16px/);
  assert.match(source, /@media \(max-width: 767px\)[\s\S]*?\.updates-filter-chip[\s\S]*?min-height: 40px/);
});
