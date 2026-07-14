import assert from "node:assert/strict";
import test from "node:test";

import { resolveLanguageSwitchUrl } from "../src/lib/navigation.js";

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
