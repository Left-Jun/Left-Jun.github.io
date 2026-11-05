import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";

const siteRoot = path.resolve(import.meta.dirname, "..");
const source = await fs.readFile(path.join(siteRoot, "src/data/psykeidos-devlogs.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
}).outputText;
const { psykeidosDevlogs, getPsykeidosDevlogSearchEntries, psykeidosDevlogUrl, devlogAsset } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("published rounds have stable distinct URLs and complete localized review data", () => {
  const ids = new Set();
  for (const entry of psykeidosDevlogs) {
    assert.match(entry.id, /^v\d{3}(?:-[a-z0-9]+)*$/);
    assert.ok(!ids.has(entry.id), `Duplicate round: ${entry.id}`);
    ids.add(entry.id);
    assert.ok(Number.isFinite(Date.parse(entry.date)));
    assert.ok(["passed", "pending"].includes(entry.technicalStatus));
    assert.ok(["pending", "accepted", "revision-needed"].includes(entry.artStatus));
    for (const lang of ["zh-cn", "en"]) {
      for (const field of ["title", "summary", "nextStep"]) assert.ok(entry[field][lang]?.trim());
      assert.equal(psykeidosDevlogUrl(lang, entry.id), `${lang === "en" ? "/en" : ""}/projects/psykeidos/devlog/${entry.id}/`);
      assert.ok(entry.changes.every((item) => item[lang]?.trim()));
      assert.ok(entry.limitations.every((item) => item[lang]?.trim()));
    }
  }
});

test("public review data does not expose private workflow, mailbox or disk references", () => {
  const serialized = JSON.stringify(psykeidosDevlogs);
  assert.doesNotMatch(serialized, /[A-Z]:[\\/]/i);
  assert.doesNotMatch(serialized, /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  assert.doesNotMatch(serialized, /file:\/\/|psykeidos-v005|automation_id|state\.json|workflow\.md/i);
  assert.doesNotMatch(serialized, /\.blend|\.zip/);
});

test("gallery assets are real local images and preserve the declared frame ratio", async () => {
  for (const entry of psykeidosDevlogs) {
    assert.ok(entry.comparison.length > 0);
    assert.ok(entry.gallery.length > 0);
    for (const image of [...entry.comparison, ...entry.gallery]) {
      assert.match(image.file, /^[a-z0-9-]+\.(jpg|webp|png)$/);
      assert.ok(image.width > 0 && image.height > 0);
      const url = devlogAsset(image.file);
      const metadata = await sharp(path.join(siteRoot, "public", url)).metadata();
      assert.ok(metadata.width && metadata.height, `Invalid image: ${image.file}`);
      assert.ok(Math.abs(metadata.width / metadata.height - image.width / image.height) < 0.002, `Frame ratio changed: ${image.file}`);
      for (const lang of ["zh-cn", "en"]) assert.ok(image.title[lang] && image.caption[lang]);
    }
  }
});

test("search exposes each round in both languages under its own project URL", () => {
  for (const lang of ["zh-cn", "en"]) {
    const entries = getPsykeidosDevlogSearchEntries(lang);
    assert.equal(entries.length, psykeidosDevlogs.length);
    for (let i = 0; i < entries.length; i++) {
      assert.equal(entries[i].section, "projects");
      assert.ok(entries[i].title.includes("Psykeidos"));
      assert.match(entries[i].url, lang === "en" ? /^\/en\/projects\/psykeidos\/devlog\/v\d+/ : /^\/projects\/psykeidos\/devlog\/v\d+/);
      assert.ok(entries[i].search.includes(entries[i].description.toLowerCase()));
      assert.ok(entries[i].tags.includes("Psykeidos"));
    }
  }
});
