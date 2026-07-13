import fs from "node:fs/promises";
import path from "node:path";
import matter from "@11ty/gray-matter";
import MarkdownIt from "markdown-it";
import { z } from "zod";

export const PUBLIC_LANGUAGES = ["zh-cn", "en"];
export const CONTENT_SECTIONS = ["projects", "posts", "retrospectives", "plans", "updates", "pages"];
export const LIST_SECTIONS = ["projects", "posts", "retrospectives", "plans", "updates"];
export const CONTENT_STATUSES = ["planned", "in-progress", "completed", "paused", "archived"];
export const UPDATE_KINDS = ["project", "event", "award", "training", "research", "release", "article"];
export const PORTFOLIO_TYPE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SECTION_LABELS = {
  projects: { zh: "项目&作品集", en: "Projects & Portfolio" },
  posts: { zh: "文章", en: "Posts" },
  retrospectives: { zh: "项目复盘", en: "Retrospectives" },
  plans: { zh: "开发计划", en: "Development Plans" },
  updates: { zh: "动态", en: "Updates" },
  pages: { zh: "页面", en: "Pages" }
};

export const projectFactsSchema = z.strictObject({
  developmentTime: z.string().optional(),
  duration: z.string().optional(),
  team: z.string().optional(),
  event: z.string().optional(),
  competition: z.string().optional(),
  role: z.string().optional(),
  roleNote: z.string().optional(),
  tools: z.string().optional(),
  techNote: z.string().optional(),
  platform: z.string().optional(),
  platformNote: z.string().optional(),
  finishedAt: z.string().optional(),
  trailerDuration: z.string().optional(),
  result: z.string().optional()
});

export function isStablePortfolioType(value) {
  return PORTFOLIO_TYPE_PATTERN.test(String(value || ""));
}

export function isSafeProjectLink(value) {
  const candidate = String(value || "");
  if (!candidate || candidate !== candidate.trim() || /[\u0000-\u0020\u007f\\]/.test(candidate)) return false;

  if (candidate.startsWith("/")) {
    if (candidate.startsWith("//") || candidate.startsWith("/\\")) return false;
    try {
      const site = new URL("https://leftjun.invalid/");
      return new URL(candidate, site).origin === site.origin;
    } catch {
      return false;
    }
  }

  try {
    const url = new URL(candidate);
    return (url.protocol === "http:" || url.protocol === "https:")
      && Boolean(url.hostname)
      && !url.username
      && !url.password;
  } catch {
    return false;
  }
}

export const projectLinkSchema = z.strictObject({
  label: z.string().min(1),
  url: z.string().min(1).refine(isSafeProjectLink, {
    message: "Project links must use a site-relative, http, or https URL"
  }),
  icon: z.string().optional()
});

export const contentFrontMatterSchema = z.looseObject({
  title: z.string().min(1),
  date: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
  draft: z.boolean().optional().default(false),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  coverVideo: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  relatedPages: z.array(z.string()).optional().default([]),
  roleTags: z.array(z.string()).optional().default([]),
  portfolioType: z.union([
    z.literal(""),
    z.string().refine(isStablePortfolioType, {
      message: "Portfolio types must use a lowercase kebab-case token"
    })
  ]).optional().default(""),
  projectFacts: projectFactsSchema.optional(),
  projectLinks: z.array(projectLinkSchema).optional(),
  featured: z.boolean().optional(),
  featuredWeight: z.number().optional(),
  homeHeroWeight: z.number().optional()
}).superRefine((data, context) => {
  if (data.coverVideo.trim() && !data.image.trim()) {
    context.addIssue({
      code: "custom",
      path: ["image"],
      message: "coverVideo requires an image poster"
    });
  }
});

export const updateFrontMatterSchema = contentFrontMatterSchema.safeExtend({
  date: z.union([z.string(), z.date()]),
  description: z.string().min(1),
  kind: z.enum(UPDATE_KINDS),
  relatedPages: z.array(z.string())
});

export const projectFrontMatterSchema = contentFrontMatterSchema.safeExtend({
  portfolioType: z.string().refine(isStablePortfolioType, {
    message: "Projects require a lowercase kebab-case portfolio type"
  })
});

export const sectionPageSchema = z.looseObject({
  title: z.string().min(1),
  slug: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  typeTitle: z.string().optional(),
  typeToggleAll: z.string().optional(),
  typeGame: z.string().optional(),
  typeEmbedded: z.string().optional(),
  indexTitle: z.string().optional()
});

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
  const schema = isSectionIndex
    ? sectionPageSchema
    : section === "projects"
      ? projectFrontMatterSchema
      : section === "updates"
        ? updateFrontMatterSchema
        : contentFrontMatterSchema;
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
    return lang === "en" ? `/en/${section}/${slug}/` : `/${section}/${slug}/`;
  }
  return lang === "en" ? `/en/${section}/${slug}/` : `/${section}/${slug}/`;
}

export function listUrl(section, lang = "zh-cn") {
  if (section === "retrospectives" || section === "plans") {
    return lang === "en" ? `/en/${section}/` : `/${section}/`;
  }
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

function mediaSrcset(variants = []) {
  return variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");
}

function applyResponsiveMedia(html, mediaManifest = {}) {
  return html.replace(/<img\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>/gi, (imageTag, quote, src) => {
    const media = mediaManifest?.[src];
    if (!media?.avif?.length || !media?.webp?.length) return imageTag;
    let fallback = imageTag;
    if (!/\bwidth=/i.test(fallback) && media.width) fallback = fallback.replace(/<img\b/i, `<img width="${media.width}"`);
    if (!/\bheight=/i.test(fallback) && media.height) fallback = fallback.replace(/<img\b/i, `<img height="${media.height}"`);
    if (!/\bdecoding=/i.test(fallback)) fallback = fallback.replace(/<img\b/i, '<img decoding="async"');
    if (!/\bloading=/i.test(fallback)) fallback = fallback.replace(/<img\b/i, '<img loading="lazy"');
    return `<picture class="content-responsive-image"><source type="image/avif" srcset="${mediaSrcset(media.avif)}" sizes="(max-width: 767px) 100vw, 920px"><source type="image/webp" srcset="${mediaSrcset(media.webp)}" sizes="(max-width: 767px) 100vw, 920px">${fallback}</picture>`;
  });
}

export function markdownToHtml(markdown, { section = "posts", id = "", mediaManifest = {} } = {}) {
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
  const html = rewriteRelativeAssets(md.render(stripBom(markdown || "")), section, id);
  return applyResponsiveMedia(html, mediaManifest);
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

  const translationGroups = new Map();
  for (const entry of entries) {
    const ref = entryRef(entry.section, entry.path);
    if (!translationGroups.has(ref)) translationGroups.set(ref, []);
    translationGroups.get(ref).push(entry);
  }

  for (const [ref, translations] of translationGroups) {
    for (const language of PUBLIC_LANGUAGES) {
      const count = translations.filter((entry) => entry.lang === language).length;
      if (count === 0) {
        const pathForError = translations[0]?.path || ref;
        errors.push({ path: pathForError, message: `Missing ${language} translation for ${ref}` });
      } else if (count > 1) {
        const pathForError = translations.find((entry) => entry.lang === language)?.path || ref;
        errors.push({ path: pathForError, message: `Duplicate ${language} translation for ${ref}` });
      }
    }

    const slugs = new Set(translations.map((entry) => entrySlug({
      id: entry.path,
      data: entry.frontMatter
    })));
    if (slugs.size > 1) {
      const pathForError = translations[0]?.path || ref;
      errors.push({ path: pathForError, message: `Translation slug mismatch for ${ref}: ${[...slugs].join(", ")}` });
    }

    const invariantKeys = ["date", "updatedAt", "status", "draft", "relatedPages", "coverVideo"];
    if (translations[0]?.section === "projects") {
      invariantKeys.push("portfolioType", "featured", "featuredWeight", "homeHeroWeight", "pinWeight", "weight");
    }
    if (translations[0]?.section === "updates") invariantKeys.push("kind");

    if (translations.length === PUBLIC_LANGUAGES.length) {
      for (const key of invariantKeys) {
        const comparable = translations.map((entry) => {
          const value = entry.frontMatter[key];
          if ((key === "date" || key === "updatedAt") && value) {
            const timestamp = new Date(value).getTime();
            return Number.isNaN(timestamp) ? String(value) : timestamp;
          }
          if (key === "draft") return Boolean(value);
          if (key === "coverVideo") return JSON.stringify(String(value || "").trim());
          if (Array.isArray(value)) return JSON.stringify([...value].sort());
          return JSON.stringify(value ?? null);
        });
        if (new Set(comparable).size > 1) {
          errors.push({
            path: translations[0]?.path || ref,
            message: `Translation metadata mismatch for ${ref}: ${key}`
          });
        }
      }
    }
  }

  const routeOwners = new Map([
    ["/", "<zh-cn home>"],
    ["/en/", "<en home>"]
  ]);
  for (const language of PUBLIC_LANGUAGES) {
    for (const section of LIST_SECTIONS) {
      routeOwners.set(listUrl(section, language), `<${section} index>`);
    }
  }
  for (const entry of entries.filter((item) => !item.isSectionIndex)) {
    const routeKey = entryUrl(entry.section, {
      id: entry.path,
      data: entry.frontMatter
    }, entry.lang);
    const existing = routeOwners.get(routeKey);
    if (existing && existing !== entry.path) {
      errors.push({ path: entry.path, message: `Duplicate public route for ${routeKey}: ${existing}, ${entry.path}` });
    } else {
      routeOwners.set(routeKey, entry.path);
    }
  }

  return {
    ok: errors.length === 0,
    total: entries.length,
    errors
  };
}
