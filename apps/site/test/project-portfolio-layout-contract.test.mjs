import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const [page, card] = await Promise.all([
  fs.readFile(new URL("../src/components/ProjectsPage.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/ProjectPortfolioCard.astro", import.meta.url), "utf8")
]);

test("project portfolio uses container-owned hierarchy instead of viewport column jumps", () => {
  assert.match(page, /container:\s*projects-portfolio\s*\/\s*inline-size/);
  assert.match(
    page,
    /\.projects-portfolio__core-grid,[\s\S]*?\.projects-portfolio__archive-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/
  );
  assert.match(
    page,
    /@container projects-portfolio \(min-width: 960px\)[\s\S]*?\.projects-portfolio__archive-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/
  );
  assert.doesNotMatch(page, /\.projects-portfolio__core-grid\s*\{\s*grid-template-columns:\s*repeat\(/);
  assert.doesNotMatch(page, /repeat\(auto-(?:fit|fill)/);
});

test("core case rows and compact archive cards keep distinct media contracts", () => {
  assert.match(card, /data-project-card-variant=\{variant\}/);
  assert.match(card, /const coverSizes = priority/);
  assert.match(card, /auto, \(max-width: 519px\) calc\(100vw - 32px\), 176px/);
  assert.match(card, /auto, \(max-width: 719px\) calc\(100vw - 32px\), 42vw/);
  assert.match(card, /\(max-width: 1010px\) calc\(100vw - 280px\)/);
  assert.match(
    card,
    /@container projects-portfolio \(min-width: 720px\)[\s\S]*?\.portfolio-project-card--core\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 42%\) minmax\(0, 1fr\)/
  );
  assert.match(
    card,
    /@container projects-portfolio \(min-width: 520px\)[\s\S]*?\.portfolio-project-card--archive\s*\{[\s\S]*?grid-template-columns:\s*176px minmax\(0, 1fr\)/
  );
  assert.match(
    card,
    /\.portfolio-project-card--archive \.portfolio-project-card__media\s*\{[\s\S]*?width:\s*176px/
  );
  assert.match(card, /\.portfolio-project-card__media\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/);
});

test("archive cards keep complete titles, two-line outcomes, and no evidence action", () => {
  const archiveTitleRule = card.match(/\.portfolio-project-card--archive h3\s*\{([^}]*)\}/)?.[1] || "";
  assert.match(card, /const archiveDescriptor = role/);
  assert.match(card, /variant === "archive" && archiveDescriptor/);
  assert.match(archiveTitleRule, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(archiveTitleRule, /-webkit-line-clamp/);
  assert.match(
    card,
    /\.portfolio-project-card--archive \.portfolio-project-card__statement--result span\s*\{[\s\S]*?-webkit-line-clamp:\s*2/
  );
  assert.match(card, /variant === "core" && evidence &&/);
});
