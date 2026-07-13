import path from "node:path";
import MarkdownIt from "markdown-it";
import { parseFragment } from "parse5";
import { baseEntryId, isExternalUrl, listContentFiles } from "../packages/content-model/src/index.js";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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
