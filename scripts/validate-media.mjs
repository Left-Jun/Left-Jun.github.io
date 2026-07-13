import fs from "node:fs/promises";
import path from "node:path";
import {
  collectContentCoverVideoSources,
  collectContentImageSources,
  publicMediaUrl,
  validateCoverVideoSources
} from "./media-sources.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(repoRoot, "apps/site/src/content");
const publicRoot = path.join(repoRoot, "apps/site/public");
const manifestPath = path.join(repoRoot, "apps/site/src/data/media-manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const errors = [];
let largest = { src: "", bytes: 0 };

const referencedSources = await collectContentImageSources({ contentRoot, publicRoot });
for (const sourcePath of referencedSources) {
  const source = publicMediaUrl(publicRoot, sourcePath);
  if (!manifest[source]) errors.push(`Referenced image missing responsive mapping: ${source}`);
}

const coverVideoSources = await collectContentCoverVideoSources({ contentRoot, publicRoot });
errors.push(...await validateCoverVideoSources(coverVideoSources));

for (const [source, item] of Object.entries(manifest)) {
  const sourcePath = path.join(publicRoot, source.replace(/^\//, ""));
  try {
    await fs.access(sourcePath);
  } catch {
    errors.push(`Missing source image: ${source}`);
  }

  for (const variant of [...(item.avif || []), ...(item.webp || [])]) {
    const variantPath = path.join(publicRoot, variant.src.replace(/^\//, ""));
    try {
      const stat = await fs.stat(variantPath);
      if (stat.size > largest.bytes) largest = { src: variant.src, bytes: stat.size };
      if (stat.size > 350 * 1024) errors.push(`Image budget exceeded: ${variant.src}`);
    } catch {
      errors.push(`Missing responsive image: ${variant.src}`);
    }
  }

  if (!item.poster || !(item.webp || []).some((variant) => variant.src === item.poster)) {
    errors.push(`Invalid poster mapping: ${source}`);
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  sources: Object.keys(manifest).length,
  largestVariant: largest.src,
  largestVariantKb: Math.round(largest.bytes / 1024)
}, null, 2));
