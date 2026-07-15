import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

import { resolveAboutUrl, resolveLanguageSwitchUrl } from "../src/lib/navigation.js";

const sidebarSource = await fs.readFile(new URL("../src/components/Sidebar.astro", import.meta.url), "utf8");

test("resolves the current-language About destination from the main menu", () => {
  assert.equal(resolveAboutUrl([{ identifier: "about", url: "/profile/" }], "zh-cn"), "/profile/");
  assert.equal(resolveAboutUrl([{ identifier: "about", url: "/en/profile/" }], "en"), "/en/profile/");
});

test("falls back to bilingual About routes for missing or unsafe menu entries", () => {
  assert.equal(resolveAboutUrl([], "zh-cn"), "/about/");
  assert.equal(resolveAboutUrl(undefined, "en"), "/en/about/");
  assert.equal(resolveAboutUrl([{ identifier: "about", url: "https://example.com/about" }], "en"), "/en/about/");
  assert.equal(resolveAboutUrl([{ identifier: "about", url: "//example.com/about" }], "zh-cn"), "/about/");
});

test("sidebar identity links target About while the brand logo remains a home link", () => {
  assert.match(sidebarSource, /<BrandLogo href=\{text\.homeUrl\} \/>/);
  assert.match(sidebarSource, /<a href=\{aboutUrl\} aria-label=\{aboutLinkLabel\}>\s*<img class="site-logo"/);
  assert.match(sidebarSource, /<div class="site-name"><a href=\{aboutUrl\} aria-label=\{aboutLinkLabel\}>\{config\.title\}<\/a><\/div>/);
  assert.match(sidebarSource, /const aboutLinkLabel = isEn \? "About Left Jun" : "关于 Left Jun";/);
});

test("prefers an explicit alternate URL over an alternate path", () => {
  assert.equal(resolveLanguageSwitchUrl({
    lang: "zh-cn",
    active: "projects",
    alternateUrl: "/en/projects/paired-project/",
    alternatePath: "/en/projects/"
  }), "/en/projects/paired-project/");
});

test("uses an explicit alternate path when no paired URL exists", () => {
  assert.equal(resolveLanguageSwitchUrl({
    lang: "en",
    active: "posts",
    alternatePath: "/posts/columns/gameplay/"
  }), "/posts/columns/gameplay/");
});

test("falls back to the matching section landing page", () => {
  assert.equal(resolveLanguageSwitchUrl({ lang: "zh-cn", active: "updates" }), "/en/updates/");
  assert.equal(resolveLanguageSwitchUrl({ lang: "en", active: "plans" }), "/plans/");
  assert.equal(resolveLanguageSwitchUrl({ lang: "zh-cn", active: "about" }), "/en/about/");
  assert.equal(resolveLanguageSwitchUrl({ lang: "en", active: "contact" }), "/contact/");
});

test("returns the other-language home for 404 and unknown sections", () => {
  assert.equal(resolveLanguageSwitchUrl({ lang: "zh-cn", active: "" }), "/en/");
  assert.equal(resolveLanguageSwitchUrl({ lang: "en", active: "404" }), "/");
  assert.equal(resolveLanguageSwitchUrl({ lang: "zh-cn", active: "unknown" }), "/en/");
});

test("ignores unsafe alternate values before applying the fallback", () => {
  assert.equal(resolveLanguageSwitchUrl({
    lang: "zh-cn",
    active: "projects",
    alternateUrl: "javascript:alert(1)",
    alternatePath: "/en/projects/"
  }), "/en/projects/");
});
