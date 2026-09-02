import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const [access, layout, card, feature] = await Promise.all([
  fs.readFile(new URL("../src/components/GuangheAccess.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/ProgramProjectLayout.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/ProgramProjectCard.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/GuangheProgramFeature.astro", import.meta.url), "utf8")
]);

test("Guanghe access gate uses authenticated session-tab decryption", () => {
  assert.match(access, /data-guanghe-manifest-url/);
  assert.match(access, /PBKDF2/);
  assert.match(access, /AES-GCM/);
  assert.match(access, /sessionStorage/);
  assert.match(access, /verifyAndRead/);
  assert.match(access, /asset integrity failed/);
  assert.match(access, /window\.open\("about:blank"/);
  assert.doesNotMatch(access, /innerHTML/);
});

test("protected project pages expose a summary and no direct attachment URL", () => {
  assert.match(layout, /<GuangheAccess entry=\{entry\} lang=\{lang\} \/>/);
  assert.match(layout, /noindex, noarchive/);
  assert.doesNotMatch(layout, /ProjectAttachmentFolders|entry\.data\.attachmentGroups|entry\.data\.mentorFeedback/);
  assert.match(card, /data\.access === "password"/);
  assert.match(feature, /entry\.data\.access === "password"/);
});

test("encrypted public manifest contains no plaintext attachment names", async () => {
  const manifest = await fs.readFile(new URL("../public/protected/guanghe/manifest.json", import.meta.url), "utf8");
  assert.match(manifest, /AES-256-GCM/);
  assert.doesNotMatch(manifest, /导师评语|光核课题三_AI赋能游戏项目管理|研究报告统一语言规范/);
});
