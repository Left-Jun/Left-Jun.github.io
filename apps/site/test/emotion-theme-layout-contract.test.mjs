import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import test from "node:test";
import { VISUAL_THEME_IDS } from "../../../packages/content-model/src/index.js";

const baseLayoutUrl = new URL("../src/layouts/BaseLayout.astro", import.meta.url);
const projectLayoutUrl = new URL("../src/components/ProjectLayout.astro", import.meta.url);
const articleLayoutUrl = new URL("../src/components/ArticleLayout.astro", import.meta.url);
const themeCssUrl = new URL("../src/styles/emotion-theme.css", import.meta.url);
const themeRegistryUrl = new URL("../src/lib/visual-themes.ts", import.meta.url);
const manifestUrl = new URL("../src/data/media-manifest.json", import.meta.url);
const backgroundUrl = new URL("../public/theme-assets/emotion-mask/page-background.png", import.meta.url);

async function sha256(url) {
  return crypto.createHash("sha256").update(await fs.readFile(url)).digest("hex").toUpperCase();
}

test("site theme definitions match the shared content registry", async () => {
  const source = await fs.readFile(themeRegistryUrl, "utf8");
  const definedIds = [...source.matchAll(/^\s{2}"([^"]+)": \{$/gm)].map((match) => match[1]);
  assert.deepEqual(definedIds, VISUAL_THEME_IDS);
});

test("the themed backdrop is decorative and stays outside head metadata", async () => {
  const [baseLayout, projectLayout, articleLayout] = await Promise.all([
    fs.readFile(baseLayoutUrl, "utf8"),
    fs.readFile(projectLayoutUrl, "utf8"),
    fs.readFile(articleLayoutUrl, "utf8")
  ]);

  const headEnd = baseLayout.indexOf("</head>");
  const backdrop = baseLayout.indexOf("data-visual-theme-backdrop");
  assert.ok(headEnd > 0 && backdrop > headEnd);
  assert.doesNotMatch(baseLayout.slice(0, headEnd), /theme-assets\/emotion-mask/);
  assert.match(baseLayout, /class="visual-theme-backdrop" aria-hidden="true"/);
  assert.match(baseLayout, /fetchpriority="low"/);
  assert.match(projectLayout, /visualTheme=\{String\(entry\.data\.visualTheme \|\| ""\)\}/);
  assert.match(articleLayout, /visualTheme=\{String\(entry\.data\.visualTheme \|\| ""\)\}/);
});

test("Emotion Mask theme background keeps its exact source and responsive variants", async () => {
  const manifest = JSON.parse(await fs.readFile(manifestUrl, "utf8"));
  const background = manifest["/theme-assets/emotion-mask/page-background.png"];

  assert.equal(await sha256(backgroundUrl), "22768476843CFDBCDA409C08AA4FBD17424C1F2D7C3F4D9D7C2C3ED45B1848D7");
  assert.deepEqual([background.width, background.height], [1438, 810]);
  assert.deepEqual(background.avif.map((item) => item.width), [480, 960, 1438]);
  assert.deepEqual(background.webp.map((item) => item.width), [480, 960, 1438]);
});

test("themed desktop sidebars keep the TOC title fixed while only links scroll", async () => {
  const css = await fs.readFile(themeCssUrl, "utf8");
  assert.match(
    css,
    /body\.article-page\[data-visual-theme="emotion-mask"\] \.site-content-layout\.has-right-sidebar > \.right-sidebar \{[\s\S]*?overflow-x: visible;[\s\S]*?overflow-y: visible/
  );
  assert.match(css, /\.right-sidebar \.widget--toc \{[\s\S]*?display: flex;[\s\S]*?overflow: hidden/);
  assert.match(css, /\.right-sidebar \.widget--toc \.widget-title \{[\s\S]*?flex: 0 0 auto/);
  assert.match(css, /\.right-sidebar \.widget--toc \.toc-nav \{[\s\S]*?grid-auto-rows: max-content;[\s\S]*?overflow-y: auto/);
});
