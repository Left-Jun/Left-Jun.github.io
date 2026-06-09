import { languageKey } from "./content.js";

export const postColumnDefinitions = [
  {
    id: "technical",
    accent: "technical",
    terms: {
      "zh-cn": ["Astro", "建站", "技术"],
      en: ["Astro", "Site Building", "Technical Notes"]
    },
    labels: {
      "zh-cn": {
        label: "技术集合",
        badge: "专栏 · 技术集合",
        eyebrow: "专栏",
        title: "技术集合",
        description: "收录建站、工具链与技术实现相关的阶段性笔记。",
        latestLabel: "最新文章",
        countSuffix: "篇收录",
        viewAll: "查看全部",
        pageTitle: "技术集合",
        pageSubtitle: "该专栏下所有文章",
        allArticlesTitle: "技术集合下的全部文章",
        backLabel: "文章与专栏"
      },
      en: {
        label: "Technical Collection",
        badge: "Column · Technical Collection",
        eyebrow: "Column",
        title: "Technical Collection",
        description: "Site-building, tooling, and implementation notes collected as a technical column.",
        latestLabel: "Latest article",
        countSuffix: "saved",
        viewAll: "View all",
        pageTitle: "Technical Collection",
        pageSubtitle: "All articles in this column",
        allArticlesTitle: "All Technical Collection articles",
        backLabel: "Articles & Columns"
      }
    }
  }
];

export function postColumnUrl(id, lang = "zh-cn") {
  return languageKey(lang) === "en" ? `/en/posts/columns/${id}/` : `/posts/columns/${id}/`;
}

export function getPostColumnDefinitions(lang = "zh-cn") {
  const key = languageKey(lang);
  return postColumnDefinitions.map((column) => ({
    id: column.id,
    accent: column.accent,
    terms: column.terms[key] || [],
    url: postColumnUrl(column.id, key),
    ...column.labels[key]
  }));
}

export function postMatchesColumn(entry, column) {
  const termSet = new Set((column.terms || []).map((term) => String(term).toLowerCase()));
  const entryTerms = [...(entry.data.categories || []), ...(entry.data.tags || [])].map((term) =>
    String(term).toLowerCase()
  );
  return entryTerms.some((term) => termSet.has(term));
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
