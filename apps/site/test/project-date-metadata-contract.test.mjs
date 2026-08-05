import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

import { formatProjectMonth } from "../src/lib/project-date.js";

const componentUrls = [
  new URL("../src/components/ProjectCard.astro", import.meta.url),
  new URL("../src/components/ProgramProjectCard.astro", import.meta.url),
  new URL("../src/components/ProjectPortfolioCard.astro", import.meta.url),
  new URL("../src/components/ProjectLayout.astro", import.meta.url),
  new URL("../src/components/ProgramProjectLayout.astro", import.meta.url)
];

const components = await Promise.all(componentUrls.map((url) => fs.readFile(url, "utf8")));

test("project dates use a stable year-month format", () => {
  assert.equal(formatProjectMonth("2026-06-26T10:00:00+08:00"), "2026.06");
  assert.equal(formatProjectMonth(new Date("2025-11-20T10:00:00+08:00")), "2025.11");
  assert.equal(formatProjectMonth(undefined), "");
  assert.equal(formatProjectMonth("not-a-date"), "");
});

test("all project cards and layouts show the date without a record-date label", () => {
  for (const source of components) {
    assert.match(source, /formatProjectMonth/);
    assert.doesNotMatch(source, /Record date|记录日期/);
  }
});

test("development time and cycle are not conflated", () => {
  const portfolioCard = components[2];
  const projectLayout = components[3];
  for (const source of [portfolioCard, projectLayout]) {
    assert.doesNotMatch(source, /facts\.duration\s*\|\|\s*facts\.developmentTime/);
    assert.match(source, /facts\.developmentTime/);
    assert.match(source, /facts\.duration/);
  }
  assert.doesNotMatch(projectLayout, /inferredTeam/);
});
