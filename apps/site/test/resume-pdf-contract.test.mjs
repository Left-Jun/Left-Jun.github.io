import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const componentUrls = [
  "src/components/SiteTopChrome.astro",
  "src/components/Sidebar.astro",
  "src/components/ArticleLayout.astro",
  "src/components/ContactPage.astro",
  "src/lib/content.js"
].map((path) => new URL(path, root));
const components = (await Promise.all(componentUrls.map((url) => fs.readFile(url, "utf8")))).join("\n");
const primaryPdf = await fs.readFile(new URL("public/files/left-jun-ai-game-project-management.pdf", root));
const legacyPdf = await fs.readFile(new URL("public/files/left-jun-portfolio.pdf", root));
const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase();

test("all visible PDF entry points use the resume URL and labels", () => {
  assert.match(components, /left-jun-ai-game-project-management\.pdf/);
  assert.match(components, /简历 PDF/);
  assert.match(components, /Resume PDF/);
  assert.match(components, /左涵俊_AI协作游戏项目管理_四川大学_2029届\.pdf/);
  assert.doesNotMatch(components, /作品集 PDF|Portfolio PDF|left-jun-portfolio\.pdf/);
});

test("legacy PDF URL remains a byte-identical alias of the supplied resume", () => {
  assert.equal(sha256(primaryPdf), "29EF3B6BDA5C50DA2DF07C24780A0203C55E3F7E1C8ACBDEB6BEB18505AF844E");
  assert.equal(sha256(legacyPdf), sha256(primaryPdf));
});
