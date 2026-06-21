import { getCollection } from "astro:content";
import siteConfig from "../data/site-config.json";
import sections from "../data/sections.json";
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
  listUrl,
  markdownToHtml,
  readTimeMinutes,
  sortByDateDesc,
  slugify
} from "@left-jun/content-model";

export const config = siteConfig;
export const sectionMeta = sections;
export const sectionsWithLists = ["projects", "posts", "retrospectives", "plans"];

export function languageKey(lang) {
  return lang === "en" ? "en" : "zh-cn";
}

export function isEnglish(lang) {
  return languageKey(lang) === "en";
}

export function pageLanguage(entry) {
  return languageFromPath(entry.id);
}

export function toSiteEntry(section, entry) {
  const lang = pageLanguage(entry);
  const data = {
    ...entry.data,
    date: entry.data.date ? new Date(entry.data.date) : undefined
  };
  const modelEntry = {
    id: entry.id,
    collection: section,
    section,
    lang,
    data,
    body: entry.body || "",
    isSectionIndex: isSectionIndex(entry.id)
  };
  return {
    ...modelEntry,
    slug: entrySlug(modelEntry),
    ref: entryRef(section, entry.id),
    url: entryUrl(section, modelEntry, lang),
    asset: (value) => assetUrl(section, entry.id, value),
    html: markdownToHtml(entry.body || "", { section, id: entry.id }),
    toc: buildToc(entry.body || ""),
    readingMinutes: readTimeMinutes(entry.body || ""),
    formattedDate: formatDate(data.date, lang)
  };
}

export async function getEntries(section, options = {}) {
  const entries = await getCollection(section);
  const mapped = entries.map((entry) => toSiteEntry(section, entry));
  const filtered = mapped.filter((entry) => {
    if (!options.includeIndexes && entry.isSectionIndex) return false;
    if (options.lang && entry.lang !== options.lang) return false;
    if (!options.includeDrafts && entry.data.draft) return false;
    return true;
  });
  if (section === "projects") return sortProjects(filtered);
  return sortByDateDesc(filtered);
}

function sortProjects(entries) {
  return [...entries].sort((a, b) => {
    const ap = Number.isFinite(a.data?.pinWeight) ? a.data.pinWeight : null;
    const bp = Number.isFinite(b.data?.pinWeight) ? b.data.pinWeight : null;
    if (ap !== null || bp !== null) return (ap ?? Number.POSITIVE_INFINITY) - (bp ?? Number.POSITIVE_INFINITY);
    const aw = Number.isFinite(a.data?.weight) ? a.data.weight : Number.POSITIVE_INFINITY;
    const bw = Number.isFinite(b.data?.weight) ? b.data.weight : Number.POSITIVE_INFINITY;
    if (aw !== bw) return aw - bw;
    return sortByDateDesc([a, b])[0] === a ? -1 : 1;
  });
}

export async function getAllEntries(options = {}) {
  const groups = await Promise.all(sectionsWithLists.map((section) => getEntries(section, options)));
  return groups.flat();
}

export function taxonomySlug(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const aliases = new Map([
    ["c#", "csharp"],
    ["c sharp", "csharp"],
    ["c++", "cpp"],
    ["cplusplus", "cpp"],
    [".net", "dotnet"]
  ]);
  return aliases.get(normalized) || slugify(value);
}

export function taxonomyTermUrl(kind, term, lang = "zh-cn") {
  const section = kind === "categories" ? "categories" : "tags";
  const slug = taxonomySlug(term);
  return languageKey(lang) === "en" ? `/en/${section}/${slug}/` : `/${section}/${slug}/`;
}

export async function getTaxonomyTerms(kind, lang = "zh-cn") {
  const field = kind === "categories" ? "categories" : "tags";
  const entries = await getAllEntries({ lang });
  const terms = new Map();
  for (const entry of entries) {
    for (const name of entry.data?.[field] || []) {
      const clean = String(name || "").trim();
      if (!clean) continue;
      const slug = taxonomySlug(clean);
      if (!terms.has(slug)) {
        terms.set(slug, { slug, name: clean, entries: [] });
      }
      terms.get(slug).entries.push(entry);
    }
  }
  return [...terms.values()].sort((a, b) => a.name.localeCompare(b.name, lang));
}

export async function getTaxonomyTerm(kind, slug, lang = "zh-cn") {
  const terms = await getTaxonomyTerms(kind, lang);
  return terms.find((term) => term.slug === slug) || null;
}

export async function getEntryBySlug(section, slug, lang = "zh-cn") {
  const entries = await getEntries(section, { lang });
  return entries.find((entry) => entry.slug === slug || baseEntryId(entry.id) === slug);
}

export async function getPageBySlug(slug, lang = "zh-cn") {
  return getEntryBySlug("pages", slug, lang);
}

export async function getSectionPage(section, lang = "zh-cn") {
  const collectionEntries = await getEntries(section, { includeIndexes: true });
  const exact = collectionEntries.find((entry) => entry.isSectionIndex && entry.lang === lang);
  const fallback = collectionEntries.find((entry) => entry.isSectionIndex && entry.lang === "zh-cn");
  return exact || fallback || {
    data: sectionMeta[section]?.[lang] || sectionMeta[section]?.["zh-cn"] || { title: section },
    body: "",
    html: "",
    url: listUrl(section, lang),
    lang
  };
}

export async function resolveRelated(ref, lang = "zh-cn") {
  const [section, ...rest] = String(ref || "").split("/");
  const wanted = rest.join("/");
  if (!sectionsWithLists.includes(section)) return null;
  const entries = await getEntries(section);
  const matches = entries.filter((entry) => baseEntryId(entry.id) === wanted || entry.slug === wanted);
  const key = languageKey(lang);
  const exact = matches.find((entry) => entry.lang === key);
  if (exact) return exact;
  if (key === "en") return matches.find((entry) => entry.lang === "zh-cn") || null;
  return null;
}

export async function relatedEntries(entry) {
  const refs = entry.data.relatedPages || [];
  const resolved = await Promise.all(refs.map((ref) => resolveRelated(ref, entry.lang)));
  return resolved.filter(Boolean);
}

export function siteText(lang) {
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
    allPosts: key === "en" ? "All articles & columns" : "全部文章与专栏",
    allPlans: key === "en" ? "All plans" : "全部计划",
    viewProject: key === "en" ? "View Projects" : "查看项目",
    portfolioPdf: key === "en" ? "Portfolio PDF" : "作品集 PDF",
    aboutMe: key === "en" ? "About Me" : "关于我",
    contact: key === "en" ? "Contact" : "联系我",
    selectedWork: key === "en" ? "Selected Work" : "精选作品",
    representativeProjects: key === "en" ? "Representative Projects" : "代表项目",
    howIWork: key === "en" ? "How I Work" : "工作方式",
    fromIdea: key === "en" ? "From Idea to Playable Build" : "从想法到可玩版本",
    inProgress: key === "en" ? "In Progress" : "进行中",
    developmentPlans: key === "en" ? "Development Plans" : "开发计划",
    latestNotes: key === "en" ? "Latest Updates" : "最近更新",
    postsAndRecords: key === "en" ? "Articles & Columns" : "文章与专栏",
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
    title: { zh: "玩法原型", en: "Gameplay Prototyping" },
    body: {
      zh: "用 Game Jam 式限制把机制压缩成可体验闭环，在 48 到 72 小时内验证操作、反馈和失败重试。",
      en: "Use jam constraints to turn mechanics into playable loops, validating controls, feedback, failure, and retry within 48 to 72 hours."
    },
    slugs: ["emotion-mask", "relativity-of-a-dot"]
  },
  {
    icon: "categories",
    title: { zh: "Gameplay 系统", en: "Gameplay Systems" },
    body: {
      zh: "围绕同一个设计目标组织角色控制、状态机、资源循环、检查点、UI 反馈和结算流程。",
      en: "Connect character control, state machines, resource loops, checkpoints, UI feedback, and settlement flow around one design goal."
    },
    slugs: ["ashe-lament", "emotion-mask", "ue5-coop-training-range"]
  },
  {
    icon: "messages",
    title: { zh: "叙事与关卡", en: "Narrative and Level Flow" },
    body: {
      zh: "把主题拆成世界观、关卡路径、交互道具、对话文案、美术需求和最终演出节奏。",
      en: "Translate themes into worlds, level routes, interactive props, dialogue, art requirements, and final beats."
    },
    slugs: ["time-echo", "ashe-lament"]
  },
  {
    icon: "link",
    title: { zh: "软硬件联调", en: "Hardware Integration" },
    body: {
      zh: "实践 STM32、PCB、无线通信、输入采样、PWM 输出、供电稳定和整机调试。",
      en: "Work with STM32, PCB design, wireless communication, input sampling, PWM output, power stability, and integration debugging."
    },
    slugs: ["smart-boat"]
  }
];
