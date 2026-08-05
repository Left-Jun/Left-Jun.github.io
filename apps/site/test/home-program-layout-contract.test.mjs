import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const [homeZh, homeEn, projectsPage, programCard] = await Promise.all([
  fs.readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/pages/en/index.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/ProjectsPage.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/ProgramProjectCard.astro", import.meta.url), "utf8")
]);

test("home uses exactly three explicit representative projects", () => {
  for (const page of [homeZh, homeEn]) {
    assert.match(
      page,
      /const featured = \(await Promise\.all\(\[\s*"emotion-mask",\s*"ashe-lament",\s*"ue5-coop-training-range"\s*\]/
    );
    assert.doesNotMatch(page, /const featured = projects\s*\.filter\(\(entry\) => entry\.data\.featured\)/);
    assert.doesNotMatch(page, /home-introduction/);
  }
});

test("home keeps Guanghe outside the dashboard and before posts", () => {
  for (const page of [homeZh, homeEn]) {
    const dashboardIndex = page.indexOf('<section class="home-dashboard"');
    const programIndex = page.indexOf('<section class="home-section home-guanghe-program"');
    const postsIndex = page.indexOf('<section class="home-section home-latest-posts"');

    assert.ok(dashboardIndex >= 0);
    assert.ok(programIndex > dashboardIndex);
    assert.ok(postsIndex > programIndex);
    assert.equal(page.slice(dashboardIndex, programIndex).match(/home-guanghe-program/g), null);
  }
});

test("project portfolio inserts the compact Guanghe row between core and archive", () => {
  const coreIndex = projectsPage.indexOf('data-project-section="core"');
  const programIndex = projectsPage.indexOf('class="projects-portfolio__section projects-program"');
  const archiveIndex = projectsPage.indexOf('data-project-section="archive"');

  assert.ok(coreIndex >= 0);
  assert.ok(programIndex > coreIndex);
  assert.ok(archiveIndex > programIndex);
  assert.match(projectsPage, /programProjects\.map\(\(entry\) => <ProgramProjectCard entry=\{entry\} lang=\{lang\} \/>\)/);
  assert.doesNotMatch(projectsPage, /programProjects\.map[\s\S]*?variant="core"/);
  assert.match(projectsPage, /splitProjectPortfolio\(portfolioProjects, 2\)/);
});

test("Guanghe cards are compact and contain no cover media", () => {
  assert.match(programCard, /program-project-card__description[\s\S]*?-webkit-line-clamp:\s*2/);
  assert.doesNotMatch(programCard, /CoverMedia|program-project-card__media|imageUrl|videoUrl/);
  assert.match(programCard, /@media \(max-width: 767px\)[\s\S]*?min-height:\s*136px/);
});
