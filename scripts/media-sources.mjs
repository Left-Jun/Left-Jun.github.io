import fs from "node:fs/promises";
import path from "node:path";
import MarkdownIt from "markdown-it";
import { parseFragment } from "parse5";
import { baseEntryId, isExternalUrl, listContentFiles } from "../packages/content-model/src/index.js";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const supportedCoverVideoExtensions = new Set([".mp4", ".webm"]);
const responsiveThemeImages = [
  "theme-assets/emotion-mask/page-background.png"
];

export function publicMediaUrl(publicRoot, sourcePath) {
  return `/${path.relative(publicRoot, sourcePath).split(path.sep).join("/")}`;
}

export async function collectContentImageSources({ contentRoot, publicRoot }) {
  const entries = await listContentFiles(contentRoot);
  const sources = new Set();
  const markdown = new MarkdownIt({ html: true });

  const addSource = (entry, image) => {
    const value = String(image || "").trim();
    if (!value || isExternalUrl(value) || value.startsWith("data:") || value.startsWith("#")) return;
    const extension = path.extname(value.split(/[?#]/)[0]).toLowerCase();
    if (!supportedExtensions.has(extension)) return;
    const absolute = value.startsWith("/")
      ? path.join(publicRoot, value.replace(/^\/+/, ""))
      : path.join(publicRoot, "content-assets", entry.section, baseEntryId(entry.path), value);
    const resolved = path.resolve(absolute);
    if (resolved.startsWith(`${publicRoot}${path.sep}`)) sources.add(resolved);
  };

  const collectRenderedImages = (entry) => {
    const fragment = parseFragment(markdown.render(entry.body || ""));
    const visit = (node) => {
      if (node.nodeName === "img") {
        const source = node.attrs?.find((attribute) => attribute.name === "src")?.value;
        addSource(entry, source);
      }
      for (const child of node.childNodes || []) visit(child);
    };
    visit(fragment);
  };

  for (const entry of entries) {
    if (!entry.isSectionIndex) addSource(entry, entry.frontMatter.image);
    collectRenderedImages(entry);
  }

  return [...sources].sort();
}

export async function collectResponsiveImageSources({ contentRoot, publicRoot }) {
  const contentImages = await collectContentImageSources({ contentRoot, publicRoot });
  const themeImages = responsiveThemeImages.map((relativePath) => path.resolve(publicRoot, relativePath));
  return [...new Set([...contentImages, ...themeImages])].sort();
}

export async function collectContentCoverVideoSources({ contentRoot, publicRoot }) {
  const entries = await listContentFiles(contentRoot);
  const sources = [];
  const resolvedPublicRoot = path.resolve(publicRoot);

  for (const entry of entries) {
    const value = String(entry.frontMatter.coverVideo || "").trim();
    if (!value || /^(https?:)?\/\//i.test(value)) continue;

    const cleanValue = value.split(/[?#]/)[0];
    const invalidReference = /^(?:data:|#|mailto:|tel:)/i.test(value);
    const extension = path.extname(cleanValue).toLowerCase();
    const absolute = value.startsWith("/")
      ? path.join(publicRoot, cleanValue.replace(/^\/+/, ""))
      : path.join(publicRoot, "content-assets", entry.section, baseEntryId(entry.path), cleanValue);
    const sourcePath = path.resolve(absolute);
    const relativeToPublicRoot = path.relative(resolvedPublicRoot, sourcePath);

    sources.push({
      entryPath: entry.path,
      value,
      extension,
      sourcePath,
      supported: supportedCoverVideoExtensions.has(extension),
      ...(invalidReference ? { invalidReference: true } : {}),
      withinPublicRoot: relativeToPublicRoot !== ""
        && !relativeToPublicRoot.startsWith(`..${path.sep}`)
        && relativeToPublicRoot !== ".."
        && !path.isAbsolute(relativeToPublicRoot)
    });
  }

  return sources.sort((left, right) => left.entryPath.localeCompare(right.entryPath));
}

export async function validateCoverVideoSources(sources, { access = fs.access } = {}) {
  const errors = [];

  for (const source of sources) {
    const context = `${source.entryPath} (coverVideo: ${JSON.stringify(source.value)})`;
    if (source.invalidReference) {
      errors.push(`Invalid cover video reference; expected a local path or HTTP(S) URL: ${context}`);
      continue;
    }
    if (!source.withinPublicRoot) {
      errors.push(`Cover video resolves outside public root: ${context}`);
      continue;
    }
    if (!source.supported) {
      errors.push(`Unsupported cover video extension; expected .mp4 or .webm: ${context}`);
      continue;
    }
    try {
      await access(source.sourcePath);
    } catch {
      errors.push(`Missing cover video: ${context}`);
    }
  }

  return errors;
}
