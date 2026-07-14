import { POST_COLUMN_IDS } from "@left-jun/content-model";

export const POST_FILTER_MIN_ITEMS = 6;
export const STANDALONE_COLUMN_ID = "standalone";

const postColumnDefinitionData = {
  technical: {
    accent: "technical",
    labels: {
      "zh-cn": {
        label: "技术集合",
        badge: "专栏 · 技术集合",
        eyebrow: "技术专栏",
        title: "技术集合",
        description: "收录建站、工具链与技术实现相关的阶段性笔记。",
        latestLabel: "最近收录",
        countSuffix: "篇文章",
        viewAll: "进入专栏",
        pageTitle: "技术集合",
        pageSubtitle: "建站、工具链与实现笔记",
        allArticlesTitle: "专栏文章",
        backLabel: "文章与专栏"
      },
      en: {
        label: "Technical Collection",
        badge: "Column · Technical Collection",
        eyebrow: "Technical column",
        title: "Technical Collection",
        description: "Site-building, tooling, and implementation notes collected as a technical column.",
        latestLabel: "Latest entry",
        countSuffix: "articles",
        viewAll: "Open column",
        pageTitle: "Technical Collection",
        pageSubtitle: "Site-building, tooling, and implementation notes",
        allArticlesTitle: "Column articles",
        backLabel: "Articles & Columns"
      }
    }
  }
};

function languageKey(lang) {
  return lang === "en" ? "en" : "zh-cn";
}

export const postColumnDefinitions = POST_COLUMN_IDS.map((id) => ({
  id,
  ...postColumnDefinitionData[id]
}));

function entryTimestamp(entry) {
  const timestamp = new Date(entry?.data?.date || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function columnIds(entry) {
  return Array.isArray(entry?.data?.columnIds)
    ? entry.data.columnIds.map((value) => String(value).trim()).filter(Boolean)
    : [];
}

function entryYear(entry) {
  const date = entry?.data?.date;
  if (!date) return "";
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Shanghai" }).format(parsed);
}

export function postColumnUrl(id, lang = "zh-cn") {
  return languageKey(lang) === "en" ? `/en/posts/columns/${id}/` : `/posts/columns/${id}/`;
}

export function getPostColumnDefinitions(lang = "zh-cn") {
  const key = languageKey(lang);
  return postColumnDefinitions.map((column) => ({
    id: column.id,
    accent: column.accent,
    url: postColumnUrl(column.id, key),
    ...column.labels[key]
  }));
}

export function postMatchesColumn(entry, column) {
  return columnIds(entry).includes(String(column?.id || ""));
}

export function getPostColumns(posts, lang = "zh-cn") {
  return getPostColumnDefinitions(lang)
    .map((column) => {
      const entries = posts.filter((entry) => postMatchesColumn(entry, column));
      return {
        ...column,
        entries,
        latestEntry: entries[0] || null
      };
    })
    .filter((column) => column.entries.length > 0);
}

export function getPostColumnBadgesBySlug(posts, columns) {
  return new Map(
    posts.map((entry) => [
      entry.slug,
      columns
        .filter((column) => column.entries.some((item) => item.slug === entry.slug))
        .map((column) => column.badge)
    ])
  );
}

export function getPostColumnLinksBySlug(posts, columns) {
  return new Map(
    posts.map((entry) => [
      entry.slug,
      columns
        .filter((column) => column.entries.some((item) => item.slug === entry.slug))
        .map((column) => ({ id: column.id, label: column.label, url: column.url }))
    ])
  );
}

export function selectPostSpotlight(posts) {
  const entries = posts
    .filter((entry) => entry.data?.image || entry.data?.coverVideo)
    .sort((a, b) => entryTimestamp(b) - entryTimestamp(a));
  const featured = entries
    .filter((entry) => entry.data?.featured)
    .sort((a, b) => {
      const aWeight = Number.isFinite(a.data?.featuredWeight) ? a.data.featuredWeight : Number.POSITIVE_INFINITY;
      const bWeight = Number.isFinite(b.data?.featuredWeight) ? b.data.featuredWeight : Number.POSITIVE_INFINITY;
      return aWeight - bWeight || entryTimestamp(b) - entryTimestamp(a);
    });
  return featured[0]
    || entries[0]
    || null;
}

export function splitPostsForIndex(posts, lang = "zh-cn") {
  const spotlight = selectPostSpotlight(posts);
  return {
    spotlight,
    columns: getPostColumns(posts, lang),
    archive: spotlight ? posts.filter((entry) => entry.ref !== spotlight.ref) : [...posts]
  };
}

export function buildPostFilterOptions(posts, lang = "zh-cn") {
  const key = languageKey(lang);
  const columns = getPostColumns(posts, key).map((column) => ({
    value: column.id,
    label: column.label,
    count: column.entries.length
  }));
  const standaloneCount = posts.filter((entry) => columnIds(entry).length === 0).length;
  if (standaloneCount > 0) {
    columns.push({
      value: STANDALONE_COLUMN_ID,
      label: key === "en" ? "Independent articles" : "独立文章",
      count: standaloneCount
    });
  }

  const yearCounts = new Map();
  for (const entry of posts) {
    const year = entryYear(entry);
    if (year) yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
  }
  const years = [...yearCounts.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([value, count]) => ({ value, label: value, count }));

  return { columns, years };
}

export function shouldShowPostFilters(posts, options = buildPostFilterOptions(posts), minItems = POST_FILTER_MIN_ITEMS) {
  return posts.length >= minItems && (options.columns.length > 1 || options.years.length > 1);
}
