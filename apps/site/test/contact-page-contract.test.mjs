import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

import {
  buildNotFoundBootstrap,
  getNotFoundCopy,
  notFoundLanguage
} from "../src/lib/not-found.js";

const [configSource, contactPage, notFoundPage, contactZh, contactEn] = await Promise.all([
  fs.readFile(new URL("../src/data/site-config.json", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/ContactPage.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/pages/404.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/pages/contact.md", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/pages/contact.en.md", import.meta.url), "utf8")
]);
const config = JSON.parse(configSource);

test("contact email has one structured source shared with both language entries", () => {
  assert.equal(config.contact.email, "limenaut0@gmail.com");
  assert.match(contactZh, new RegExp(config.contact.email.replace(".", "\\.")));
  assert.match(contactEn, new RegExp(config.contact.email.replace(".", "\\.")));
  assert.match(contactPage, /config\.contact\?\.email/);
  assert.doesNotMatch(contactPage, /ArticleLayout/);
});

test("contact page exposes direct actions, existing status, topics, PDF, and social profiles", () => {
  assert.match(contactPage, /data-copy-email/);
  assert.match(contactPage, /navigator\.clipboard\?\.writeText/);
  assert.match(contactPage, /execCommand\("copy"\)/);
  assert.match(contactPage, /text\.sidebar\.status/);
  assert.match(contactPage, /"项目实现", "试玩反馈", "合作", "实习机会", "作品集材料"/);
  assert.match(contactPage, /"Implementation discussions", "Playtest feedback", "Collaboration", "Internship opportunities", "Portfolio material"/);
  assert.match(contactPage, /left-jun-portfolio\.pdf/);
  assert.match(contactPage, /text\.menus\.social/);
  assert.doesNotMatch(contactPage, /formattedDate|readingMinutes|tocItems|<form/);
});

test("not-found language follows only the leading English path segment", () => {
  assert.equal(notFoundLanguage("/en/missing/"), "en");
  assert.equal(notFoundLanguage("/EN/missing/"), "en");
  assert.equal(notFoundLanguage("/english/missing/"), "zh-cn");
  assert.equal(notFoundLanguage("/projects/missing/"), "zh-cn");
  assert.equal(getNotFoundCopy("/en/missing/").projectsUrl, "/en/projects/");
  assert.equal(getNotFoundCopy("/missing/").homeUrl, "/");
});

test("404 bootstraps language and title before rendering localized panels", () => {
  const bootstrap = buildNotFoundBootstrap();
  assert.match(bootstrap, /window\.location\.pathname/);
  assert.match(bootstrap, /root\.lang = copy\.htmlLang/);
  assert.match(bootstrap, /document\.title = copy\.documentTitle/);
  assert.match(notFoundPage, /<script is:inline set:html=\{bootstrap\}><\/script>/);
  assert.match(notFoundPage, /active="not-found"/);
  assert.match(notFoundPage, /data-not-found-back/);
  assert.match(notFoundPage, /copy\.homeUrl/);
  assert.match(notFoundPage, /copy\.projectsUrl/);
});
