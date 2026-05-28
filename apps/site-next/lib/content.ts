import fs from "node:fs/promises";
import path from "node:path";
import siteConfig from "../../site/src/data/site-config.json";
import sections from "../../site/src/data/sections.json";
import {
  assetUrl,
  baseEntryId,
  buildToc,
  entryRef,
  entrySlug,
  entryUrl,
  formatDate,
  isSectionIndex,
  languageFromPath,
  listContentFiles,
  listUrl,
  markdownToHtml,
  readTimeMinutes,
  sortByDateDesc
} from "@left-jun/content-model";

export type Lang = "zh-cn" | "en";
export type Section = "projects" | "posts" | "retrospectives" | "plans" | "pages";

export type SiteEntry = {
  id: string;
  path: string;
  section: Section;
  lang: Lang;
  data: Record<string, any>;
  body: string;
  isSectionIndex: boolean;
  slug: string;
  ref: string;
  url: string;
  html: string;
  toc: Array<{ depth: number; text: string; id: string }>;
  readingMinutes: number;
  formattedDate: string;
  asset: (value?: string) => string;
};

const contentRoot = path.resolve(process.cwd(), "..", "site", "src", "content");

export const config = siteConfig as any;
export const sectionMeta = sections as any;
export const sectionsWithLists: Section[] = ["projects", "posts", "retrospectives", "plans"];

export function languageKey(lang?: string): Lang {
  return lang === "en" ? "en" : "zh-cn";
}

export function toSiteEntry(entry: any): SiteEntry {
  const lang = languageKey(languageFromPath(entry.path));
  const data = {
    ...entry.frontMatter,
    date: entry.frontMatter.date ? new Date(entry.frontMatter.date) : undefined
  };
  const modelEntry = {
    id: entry.path.replace(/\.md$/i, ""),
    path: entry.path,
    section: entry.section,
    lang,
    data,
    body: entry.body || "",
    isSectionIndex: entry.isSectionIndex
  };
  return {
    ...modelEntry,
    slug: entrySlug(modelEntry),
    ref: entryRef(entry.section, entry.path),
    url: entryUrl(entry.section, modelEntry, lang),
    html: markdownToHtml(entry.body || "", { section: entry.section, id: entry.path }),
    toc: buildToc(entry.body || ""),
    readingMinutes: readTimeMinutes(entry.body || ""),
    formattedDate: formatDate(data.date, lang),
    asset: (value?: string) => assetUrl(entry.section, entry.path, value || "")
  };
}

export async function getEntries(section: Section, options: { lang?: Lang; includeIndexes?: boolean; includeDrafts?: boolean } = {}) {
  const entries = (await listContentFiles(contentRoot))
    .filter((entry: any) => entry.section === section)
    .map(toSiteEntry)
    .filter((entry: SiteEntry) => {
      if (!options.includeIndexes && entry.isSectionIndex) return false;
      if (options.lang && entry.lang !== options.lang) return false;
      if (!options.includeDrafts && entry.data.draft) return false;
      return true;
    });
  return sortByDateDesc(entries) as SiteEntry[];
}

export async function getAllEntries(options = {}) {
  const groups = await Promise.all(sectionsWithLists.map((section) => getEntries(section, options)));
  return groups.flat();
}

export async function getEntryBySlug(section: Section, slug: string, lang: Lang = "zh-cn") {
  const entries = await getEntries(section, { lang });
  return entries.find((entry) => entry.slug === slug || baseEntryId(entry.id) === slug);
}

export async function getPageBySlug(slug: string, lang: Lang = "zh-cn") {
  return getEntryBySlug("pages", slug, lang);
}

export async function getSectionPage(section: Section, lang: Lang = "zh-cn") {
  const entries = await getEntries(section, { includeIndexes: true });
  const exact = entries.find((entry) => entry.isSectionIndex && entry.lang === lang);
  const fallback = entries.find((entry) => entry.isSectionIndex && entry.lang === "zh-cn");
  return exact || {
    data: sectionMeta[section]?.[lang] || sectionMeta[section]?.["zh-cn"] || { title: section },
    body: "",
    html: "",
    url: listUrl(section, lang),
    lang
  };
}

export async function resolveRelated(ref: string) {
  const [section, ...rest] = String(ref || "").split("/");
  const wanted = rest.join("/");
  if (!sectionsWithLists.includes(section as Section)) return null;
  const entries = await getEntries(section as Section);
  return entries.find((entry) => baseEntryId(entry.id) === wanted || entry.slug === wanted) || null;
}

export async function relatedEntries(entry: SiteEntry) {
  const refs = entry.data.relatedPages || [];
  const resolved = await Promise.all(refs.map(resolveRelated));
  return resolved.filter(Boolean) as SiteEntry[];
}

export function siteText(lang: Lang) {
  const key = languageKey(lang);
  return {
    lang: key,
    isEn: key === "en",
    sidebar: config.languages[key]?.sidebar || config.languages["zh-cn"].sidebar,
    menus: config.languages[key]?.menus || config.languages["zh-cn"].menus,
    languageName: config.languages[key]?.languageName || key,
    homeUrl: key === "en" ? "/en/" : "/",
    switchUrl: key === "en" ? "/" : "/en/",
    switchLabel: key === "en" ? "中文" : "English",
    darkMode: key === "en" ? "Dark Mode" : "暗色模式",
    lightMode: key === "en" ? "Light Mode" : "浅色模式",
    allProjects: key === "en" ? "All projects" : "全部项目",
    allPosts: key === "en" ? "All posts" : "全部文章",
    allPlans: key === "en" ? "All plans" : "全部计划",
    viewProject: key === "en" ? "View Projects" : "查看项目",
    portfolioPdf: key === "en" ? "Portfolio PDF" : "作品集 PDF",
    aboutMe: key === "en" ? "About Me" : "关于我",
    contact: key === "en" ? "Contact" : "联系我",
    selectedWork: key === "en" ? "Selected Work" : "精选作品",
    representativeProjects: key === "en" ? "Representative Projects" : "代表项目",
    howIWork: key === "en" ? "How I Work" : "我的工作方式",
    fromIdea: key === "en" ? "From Idea to Playable Build" : "从想法到可玩版本",
    inProgress: key === "en" ? "In Progress" : "进行中",
    developmentPlans: key === "en" ? "Development Plans" : "开发计划",
    latestNotes: key === "en" ? "Latest Notes" : "最近更新",
    postsAndRecords: key === "en" ? "Posts and Records" : "文章与记录",
    projectProfile: key === "en" ? "Project Profile" : "项目档案",
    projectLinks: key === "en" ? "Project Links" : "项目链接",
    relatedRecords: key === "en" ? "Related Records" : "延伸记录",
    relatedReading: key === "en" ? "Related Reading" : "关联阅读",
    toc: key === "en" ? "Contents" : "目录",
    readMinutes: key === "en" ? "min read" : "分钟",
    viewRetrospective: key === "en" ? "View retrospective" : "查看复盘",
    viewPlan: key === "en" ? "View plan" : "查看计划"
  };
}

export const workflowItems = [
  {
    icon: "infinity",
    title: { zh: "快速原型", en: "Rapid Prototyping" },
    body: {
      zh: "用 Game Jam 式限制把想法压缩成可体验闭环，在 48 到 72 小时内验证核心机制。",
      en: "Use jam-style constraints to turn concepts into playable loops within 48 to 72 hours."
    },
    slugs: ["emotion-mask", "relativity-of-a-dot"]
  },
  {
    icon: "categories",
    title: { zh: "游戏系统", en: "Gameplay Systems" },
    body: {
      zh: "围绕同一个设计目标组织移动、状态切换、资源循环、检查点、UI 反馈和结局判定。",
      en: "Build movement, state switching, resource loops, checkpoints, UI feedback, and endings around the same design goal."
    },
    slugs: ["ashe-lament", "emotion-mask"]
  },
  {
    icon: "messages",
    title: { zh: "叙事策划", en: "Narrative Design" },
    body: {
      zh: "把主题拆成世界观、关卡流程、对话文案、美术需求和最终演出节奏。",
      en: "Translate themes into worlds, level flow, dialogue, art requirements, and final performance beats."
    },
    slugs: ["time-echo", "ashe-lament"]
  },
  {
    icon: "link",
    title: { zh: "软硬件实践", en: "Hardware Practice" },
    body: {
      zh: "实践 STM32、PCB 设计、无线通信、信号滤波和整机联调。",
      en: "Work with STM32, PCB design, wireless communication, signal filtering, and integrated debugging."
    },
    slugs: ["smart-boat"]
  }
];

export async function staticUrls() {
  const entries = await getAllEntries();
  const pages = await getEntries("pages");
  return ["/", "/en/", "/projects/", "/en/projects/", "/posts/", "/en/posts/", "/retrospectives/", "/plans/", ...entries.map((entry) => entry.url), ...pages.map((entry) => entry.url)];
}

export async function fileExists(relative: string) {
  try {
    await fs.access(path.resolve(process.cwd(), relative));
    return true;
  } catch {
    return false;
  }
}
