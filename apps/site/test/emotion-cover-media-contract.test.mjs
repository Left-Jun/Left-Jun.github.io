import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import test from "node:test";

const manifestUrl = new URL("../src/data/media-manifest.json", import.meta.url);
const coverUrl = new URL("../public/content-assets/projects/emotion-mask/cover.png", import.meta.url);
const staleVariantUrls = [
  new URL("../public/content-assets/projects/emotion-mask/cover-960.avif", import.meta.url),
  new URL("../public/content-assets/projects/emotion-mask/cover-960.webp", import.meta.url),
  new URL("../public/content-assets/projects/emotion-mask/cover-1232.avif", import.meta.url),
  new URL("../public/content-assets/projects/emotion-mask/cover-1232.webp", import.meta.url)
];

test("Emotion Mask uses the exact Steam library artwork and only current variants", async () => {
  const manifest = JSON.parse(await fs.readFile(manifestUrl, "utf8"));
  const cover = manifest["/content-assets/projects/emotion-mask/cover.png"];
  const hash = crypto.createHash("sha256").update(await fs.readFile(coverUrl)).digest("hex").toUpperCase();

  assert.equal(hash, "DF455B8CC5999BCE1D36BFD46722BC2C0A3A33FDC8A821F0FDE0A354AD191513");
  assert.deepEqual([cover.width, cover.height], [920, 430]);
  assert.deepEqual(cover.avif.map((item) => item.width), [480, 920]);
  assert.deepEqual(cover.webp.map((item) => item.width), [480, 920]);
  await Promise.all(staleVariantUrls.map((url) => assert.rejects(fs.access(url))));
});
