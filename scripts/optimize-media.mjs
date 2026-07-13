import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { collectContentImageSources } from "./media-sources.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(repoRoot, "apps/site/src/content");
const publicRoot = path.join(repoRoot, "apps/site/public");
const manifestPath = path.join(repoRoot, "apps/site/src/data/media-manifest.json");
const targetWidths = [480, 960, 1440];

function publicUrl(relativePath) {
  return `/${relativePath.split(path.sep).join("/")}`;
}

function variantPath(sourcePath, width, extension) {
  const parsed = path.parse(sourcePath);
  return path.join(parsed.dir, `${parsed.name}-${width}.${extension}`);
}

async function optimizeSource(sourcePath) {
  const relative = path.relative(publicRoot, sourcePath);
  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions: ${relative}`);
  }

  const maxWidth = Math.min(metadata.width, targetWidths.at(-1));
  const widths = [...new Set([
    ...targetWidths.filter((width) => width < maxWidth),
    maxWidth
  ])];
  const item = {
    width: metadata.width,
    height: metadata.height,
    avif: [],
    webp: [],
    poster: ""
  };

  for (const width of widths) {
    const avifPath = variantPath(sourcePath, width, "avif");
    const webpPath = variantPath(sourcePath, width, "webp");
    const pipeline = sharp(sourcePath).resize({ width, withoutEnlargement: true });

    await pipeline.clone().avif({ quality: 45, effort: 5 }).toFile(avifPath);
    await pipeline.clone().webp({ quality: 72, effort: 5, smartSubsample: true }).toFile(webpPath);

    item.avif.push({ src: publicUrl(path.relative(publicRoot, avifPath)), width });
    item.webp.push({ src: publicUrl(path.relative(publicRoot, webpPath)), width });
  }

  item.poster = item.webp.findLast((variant) => variant.width <= 960)?.src || item.webp.at(-1)?.src || "";
  return [publicUrl(relative), item];
}

sharp.cache(false);
const sources = await collectContentImageSources({ contentRoot, publicRoot });
const manifest = {};

for (const source of sources) {
  try {
    await fs.access(source);
  } catch {
    throw new Error(`Referenced content image does not exist: ${path.relative(repoRoot, source)}`);
  }
  const [url, item] = await optimizeSource(source);
  manifest[url] = item;
}

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const generated = Object.values(manifest).flatMap((item) => [...item.avif, ...item.webp]);
let largest = { src: "", bytes: 0 };
for (const variant of generated) {
  const stat = await fs.stat(path.join(publicRoot, variant.src.replace(/^\//, "")));
  if (stat.size > largest.bytes) largest = { src: variant.src, bytes: stat.size };
}

console.log(JSON.stringify({
  sources: sources.length,
  variants: generated.length,
  largestVariant: largest.src,
  largestVariantKb: Math.round(largest.bytes / 1024)
}, null, 2));

if (largest.bytes > 350 * 1024) {
  throw new Error(`Responsive image budget exceeded: ${largest.src} is ${Math.round(largest.bytes / 1024)} KiB`);
}
