import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "parse5";

const repoRoot = path.resolve(import.meta.dirname, "..");
const distRoot = path.join(repoRoot, "apps/site/dist");
const htmlFiles = [];
const themeBackground = "/theme-assets/emotion-mask/page-background";
const themedPages = [
  "projects/emotion-mask/index.html",
  "retrospectives/emotion-mask-retrospective/index.html",
  "plans/emotion-mask-roadmap/index.html",
  "en/projects/emotion-mask/index.html",
  "en/retrospectives/emotion-mask-retrospective/index.html",
  "en/plans/emotion-mask-roadmap/index.html"
];
const defaultThemePages = [
  "posts/shuguang-youji-roadshow/index.html",
  "en/posts/shuguang-youji-roadshow/index.html"
];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}

function visit(node, callback) {
  callback(node);
  for (const child of node.childNodes || []) visit(child, callback);
  if (node.content) visit(node.content, callback);
}

function localTargets(node) {
  const result = [];
  for (const attribute of node.attrs || []) {
    if (["href", "src", "poster", "data-search-index-url"].includes(attribute.name)) result.push(attribute.value);
    if (attribute.name === "srcset") {
      result.push(...attribute.value.split(",").map((item) => item.trim().split(/\s+/)[0]));
    }
  }
  return result;
}

function candidatePaths(urlPath) {
  const decoded = decodeURIComponent(urlPath).replace(/^\/+/, "").replace(/\/+$/, "");
  if (!decoded) return [path.join(distRoot, "index.html")];
  if (path.extname(decoded)) return [path.join(distRoot, decoded)];
  return [path.join(distRoot, decoded, "index.html"), path.join(distRoot, `${decoded}.html`)];
}

await walk(distRoot);
const checked = new Map();
const errors = [];

for (const htmlFile of htmlFiles) {
  const document = parse(await fs.readFile(htmlFile, "utf8"));
  visit(document, (node) => {
    for (const target of localTargets(node)) {
      if (!target.startsWith("/") || target.startsWith("//")) continue;
      const pathname = target.split(/[?#]/)[0];
      if (!pathname) continue;
      if (!checked.has(pathname)) checked.set(pathname, candidatePaths(pathname));
    }
  });
}

for (const [target, candidates] of checked) {
  const exists = (await Promise.all(candidates.map(async (candidate) => {
    try {
      return (await fs.stat(candidate)).isFile();
    } catch {
      return false;
    }
  }))).some(Boolean);
  if (!exists) errors.push({ target, candidates: candidates.map((candidate) => path.relative(distRoot, candidate)) });
}

for (const relativePath of themedPages) {
  const source = await fs.readFile(path.join(distRoot, relativePath), "utf8");
  const head = source.slice(0, source.indexOf("</head>"));
  const body = source.slice(source.indexOf("<body"));
  if (!body.includes('data-visual-theme="emotion-mask"') || !body.includes("data-visual-theme-backdrop")) {
    errors.push({ target: relativePath, reason: "missing Emotion Mask body theme" });
  }
  if (head.includes(themeBackground)) {
    errors.push({ target: relativePath, reason: "theme background leaked into head metadata or preload" });
  }
}

for (const relativePath of defaultThemePages) {
  const source = await fs.readFile(path.join(distRoot, relativePath), "utf8");
  if (source.includes('data-visual-theme="emotion-mask"') || source.includes("data-visual-theme-backdrop")) {
    errors.push({ target: relativePath, reason: "mixed-content page inherited Emotion Mask theme" });
  }
}

for (const relativePath of ["search-index.json", "en/search-index.json"]) {
  const source = await fs.readFile(path.join(distRoot, relativePath), "utf8");
  if (source.includes(themeBackground)) {
    errors.push({ target: relativePath, reason: "theme background leaked into search media" });
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, pages: htmlFiles.length, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  pages: htmlFiles.length,
  localTargets: checked.size,
  themedPages: themedPages.length
}, null, 2));
