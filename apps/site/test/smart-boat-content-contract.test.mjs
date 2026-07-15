import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { parseMarkdown } from "@left-jun/content-model";

const [zhSource, enSource, aboutZh, aboutEn] = await Promise.all([
  fs.readFile(new URL("../src/content/projects/smart-boat/index.md", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/projects/smart-boat/index.en.md", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/pages/about.md", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/content/pages/about.en.md", import.meta.url), "utf8")
]);

const zh = parseMarkdown(zhSource);
const en = parseMarkdown(enSource);

test("smart boat project records the solo competition result in both languages", () => {
  assert.equal(zh.frontMatter.projectFacts.event, "四川大学水上之星船模大赛（2026 年春）");
  assert.equal(zh.frontMatter.projectFacts.team, "1 人 / 唯一单人成队");
  assert.equal(zh.frontMatter.projectFacts.role, "独立完成软硬件设计 / 制作 / 整机联调");
  assert.equal(zh.frontMatter.projectFacts.result, "在 72 支专业组队伍中进入决赛并获得第 9 名；唯一单人成队。");
  assert.deepEqual(zh.frontMatter.roleTags, ["独立开发", "嵌入式开发", "硬件设计"]);

  assert.equal(en.frontMatter.projectFacts.event, "Sichuan University Water Star Model Boat Competition (Spring 2026)");
  assert.equal(en.frontMatter.projectFacts.team, "1 person / only solo team");
  assert.equal(en.frontMatter.projectFacts.role, "Solo hardware-software design / fabrication / integration");
  assert.equal(en.frontMatter.projectFacts.result, "Advanced to the final and placed 9th among 72 professional-division teams; the only solo team.");
  assert.deepEqual(en.frontMatter.roleTags, ["Solo Developer", "Embedded Developer", "Hardware Designer"]);
});

test("smart boat narrative and about summary do not retain the former team description", () => {
  assert.match(zh.frontMatter.description, /72 支专业组队伍/);
  assert.match(en.frontMatter.description, /72 professional-division teams/);
  assert.match(zh.body, /独立完成全部软硬件设计、制作与整机联调/);
  assert.match(en.body, /independently completed all hardware-software design, fabrication, and full-system integration/);
  assert.doesNotMatch(zhSource, /团队项目|担任队长|少数完赛/);
  assert.doesNotMatch(enSource, /Team project|team lead|few teams/i);

  assert.match(aboutZh, /四川大学水上之星船模大赛（2026 年春）/);
  assert.match(aboutZh, /72 支专业组队伍中进入决赛并获得第 9 名/);
  assert.match(aboutEn, /Sichuan University Water Star Model Boat Competition \(Spring 2026\)/);
  assert.match(aboutEn, /placed 9th among 72 professional-division teams/);
});
