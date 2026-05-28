import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { z } from "zod";

export const PUBLIC_LANGUAGES = ["zh-cn", "en"];
export const CONTENT_SECTIONS = ["projects", "posts", "retrospectives", "plans", "pages"];
export const LIST_SECTIONS = ["projects", "posts", "retrospectives", "plans"];
export const SECTION_LABELS = {
  projects: { zh: "项目&作品集", en: "Projects & Portfolio" },
  posts: { zh: "文章", en: "Posts" },
  retrospectives: { zh: "项目复盘", en: "Retrospectives" },
  plans: { zh: "开发计划", en: "Development Plans" },
  pages: { zh: "页面", en: "Pages" }
};

export const contentFrontMatterSchema = z.object({
  title: z.string().min(1),
  date: z.union([z.string(), z.date()]).optional(),
  draft: z.boolean().optional().default(false),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  coverVideo: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  relatedPages: z.array(z.string()).optional().default([]),
  roleTags: z.array(z.string()).optional().default([]),
  portfolioType: z.string().optional().default(""),
  projectFacts: z.record(z.string(), z.unknown()).optional(),
  projectLinks: z.array(z.record(z.string(), z.unknown())).optional(),
  featured: z.boolean().optional(),
  featuredWeight: z.number().optional()
}).passthrough();

export const sectionPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  typeTitle: z.string().optional(),
  typeToggleAll: z.string().optional(),
  typeGame: z.string().optional(),
  typeEmbedded: z.string().optional(),
  indexTitle: z.string().optional()
}).passthrough();

export function stripBom(text) {
  return String(text ?? "").replace(/^\uFEFF/, "");
}

export function normalizeSlash(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

export function parseMarkdown(raw) {
  const parsed = matter(stripBom(raw));
  return {
    frontMatter: normalizeFrontMatter(parsed.data || {}),
    body: stripBom(parsed.content || "")
  };
}

export function stringifyMarkdown(frontMatter, body) {
  return matter.stringify(stripBom(body || "").trimEnd() + "\n", normalizeFrontMatter(frontMatter));
}

export function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  return String(value).split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

export function normalizeFrontMatter(input = {}) {
  const copy = { ...input };
  for (const key of ["categories", "tags", "roleTags", "relatedPages"]) {
    copy[key] = normalizeArray(copy[key]);
  }
  if (copy.projectFacts && typeof copy.projectFacts === "string") {
    try {
      copy.projectFacts = JSON.parse(copy.projectFacts);
    } catch {
      copy.projectFacts = {};
    }
  }
  if (copy.projectLinks && typeof copy.projectLinks === "string") {
    try {
      copy.projectLinks = JSON.parse(copy.projectLinks);
    } catch {
      copy.projectLinks = [];
    }
  }
  return copy;
}

export function validateFrontMatter(frontMatter, { section = "posts", isSectionIndex = false } = {}) {
  const schema = isSectionIndex ? sectionPageSchema : contentFrontMatterSchema;
  const result = schema.safeParse(normalizeFrontMatter(frontMatter));
  if (!result.success) {
    const issue = result.error.issues[0];
    const location = issue?.path?.join(".") || section;
    throw new Error(`${location}: ${issue?.message || "invalid front matter"}`);
  }
  return result.data;
}

export function isSectionIndex(relativePath) {
  return /(^|\/)_index(\.en)?(\.md)?$/i.test(normalizeSlash(relativePath));
}

export function languageFromPath(relativePath) {
  return /(^|\/)[^/]+\.en(\.md)?$/i.test(normalizeSlash(relativePath)) ? "en" : "zh-cn";
}

export function sectionFromPath(relativePath) {
  const normalized = normalizeSlash(relativePath);
  const first = normalized.split("/")[0];
  return CONTENT_SECTIONS.includes(first) ? first : "pages";
}

export function slugify(value) {
  return String(value || "untitled")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";
}

export function baseEntryId(idOrPath) {
  let id = normalizeSlash(idOrPath)
    .replace(/^content\//, "")
    .replace(/^src\/content\//, "")
    .replace(/\.md$/i, "")
    .replace(/\.en$/i, "");
  for (const section of CONTENT_SECTIONS) {
    id = id.replace(new RegExp(`^${section}/`), "");
  }
  id = id.replace(/\/index$/i, "");
  return id || "index";
}

export function entryRef(section, idOrPath) {
  return `${section}/${baseEntryId(idOrPath)}`;
}

export function entrySlug(entry) {
  return slugify(entry?.data?.slug || entry?.frontMatter?.slug || baseEntryId(entry?.id || entry?.path));
}

export function entryLanguage(entry) {
  return entry?.lang || languageFromPath(entry?.id || entry?.path || "");
}

export function entryUrl(section, entry, lang = entryLanguage(entry)) {
  const slug = entrySlug(entry);
  if (section === "pages") {
    return lang === "en" ? `/en/${slug}/` : `/${slug}/`;
  }
  if (section === "retrospectives" || section === "plans") {
    return `/${section}/${slug}/`;
  }
  return lang === "en" ? `/en/${section}/${slug}/` : `/${section}/${slug}/`;
}

export function listUrl(section, lang = "zh-cn") {
  if (section === "retrospectives" || section === "plans") return `/${section}/`;
  return lang === "en" ? `/en/${section}/` : `/${section}/`;
}

export function isExternalUrl(value) {
  return /^(https?:)?\/\//i.test(String(value || "")) || /^(mailto|tel):/i.test(String(value || ""));
}

export function assetBase(section, idOrPath) {
  return `/content-assets/${section}/${baseEntryId(idOrPath)}/`;
}

export function assetUrl(section, idOrPath, value) {
  const src = String(value || "").trim();
  if (!src) return "";
  if (isExternalUrl(src) || src.startsWith("/") || src.startsWith("#") || src.startsWith("data:")) return src;
  return `${assetBase(section, idOrPath)}${normalizeSlash(src)}`;
}

export function sortByDateDesc(entries) {
  return [...entries].sort((a, b) => {
    const ad = new Date(a.data?.date || a.frontMatter?.date || 0).getTime();
    const bd = new Date(b.data?.date || b.frontMatter?.date || 0).getTime();
    return bd - ad || String(a.data?.title || a.frontMatter?.title).localeCompare(String(b.data?.title || b.frontMatter?.title));
  });
}

export function formatDate(value, lang = "zh-cn") {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function readTimeMinutes(markdown) {
  const text = stripBom(markdown).replace(/<[^>]+>/g, " ").replace(/[#>*_\-[\]()`]/g, " ");
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = (text.match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.round((cjk / 420) + (words / 210)));
}

function rewriteRelativeAssets(html, section, idOrPath) {
  return html.replace(/\s(src|href)=["']([^"']+)["']/gi, (match, attr, value) => {
    if (isExternalUrl(value) || value.startsWith("/") || value.startsWith("#") || value.startsWith("data:")) {
      return match;
    }
    if (!/\.(png|jpe?g|gif|webp|svg|mp4|webm|pdf)$/i.test(value)) {
      return match;
    }
    return ` ${attr}="${assetUrl(section, idOrPath, value)}"`;
  });
}

export function markdownToHtml(markdown, { section = "posts", id = "" } = {}) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false
  });
  const defaultHeadingOpen = md.renderer.rules.heading_open;
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const title = tokens[idx + 1]?.content || "";
    if (!token.attrGet("id") && title) {
      token.attrSet("id", slugify(title));
    }
    return defaultHeadingOpen ? defaultHeadingOpen(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
  };
  const defaultImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const src = token.attrGet("src");
    if (src) token.attrSet("src", assetUrl(section, id, src));
    token.attrSet("loading", "lazy");
    return defaultImage ? defaultImage(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
  };
  return rewriteRelativeAssets(md.render(stripBom(markdown || "")), section, id);
}

export function buildToc(markdown) {
  const result = [];
  for (const line of stripBom(markdown).split("\n")) {
    const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[#*_`[\]]/g, "").trim();
    result.push({
      depth: match[1].length,
      text,
      id: slugify(text)
    });
  }
  return result;
}

export async function walkFiles(root, predicate = () => true) {
  const files = [];
  async function visit(dir) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile() && predicate(absolute)) {
        files.push(absolute);
      }
    }
  }
  await visit(root);
  return files.sort();
}

export async function readContentFile(contentRoot, relativePath) {
  const normalized = normalizeSlash(relativePath);
  const absolute = path.resolve(contentRoot, normalized);
  const raw = await fs.readFile(absolute, "utf8");
  const parsed = parseMarkdown(raw);
  return {
    id: normalized.replace(/\.md$/i, ""),
    path: normalized,
    section: sectionFromPath(normalized),
    lang: languageFromPath(normalized),
    isSectionIndex: isSectionIndex(normalized),
    frontMatter: parsed.frontMatter,
    body: parsed.body
  };
}

export async function writeContentFile(contentRoot, relativePath, frontMatter, body) {
  const normalized = normalizeSlash(relativePath);
  const absolute = path.resolve(contentRoot, normalized);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, stringifyMarkdown(frontMatter, body), "utf8");
  return readContentFile(contentRoot, normalized);
}

export async function listContentFiles(contentRoot) {
  const markdownFiles = await walkFiles(contentRoot, (file) => file.endsWith(".md"));
  const entries = [];
  for (const absolute of markdownFiles) {
    const relative = normalizeSlash(path.relative(contentRoot, absolute));
    entries.push(await readContentFile(contentRoot, relative));
  }
  return entries;
}

export async function validateContentRoot(contentRoot) {
  const entries = await listContentFiles(contentRoot);
  const errors = [];
  const refs = new Set();

  for (const entry of entries) {
    try {
      validateFrontMatter(entry.frontMatter, {
        section: entry.section,
        isSectionIndex: entry.isSectionIndex
      });
      if (!entry.isSectionIndex) refs.add(entryRef(entry.section, entry.path));
    } catch (error) {
      errors.push({ path: entry.path, message: error.message });
    }
  }

  for (const entry of entries.filter((item) => !item.isSectionIndex)) {
    for (const ref of normalizeArray(entry.frontMatter.relatedPages)) {
      if (!refs.has(ref)) {
        errors.push({ path: entry.path, message: `Broken relatedPages reference: ${ref}` });
      }
    }
  }

  return {
    ok: errors.length === 0,
    total: entries.length,
    errors
  };
}
