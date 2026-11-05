import { getAllEntries } from "./content.js";
import { getPsykeidosDevlogSearchEntries } from "../data/psykeidos-devlogs";

const labels = {
  en: {
    projects: "Project",
    posts: "Article / Column",
    retrospectives: "Retrospective",
    plans: "Roadmap",
    updates: "Update"
  },
  "zh-cn": {
    projects: "项目",
    posts: "文章 / 专栏",
    retrospectives: "复盘",
    plans: "计划",
    updates: "动态"
  }
};

function searchableBody(markdown = "") {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1600);
}

export async function buildSearchIndex(lang = "zh-cn") {
  const key = lang === "en" ? "en" : "zh-cn";
  const sectionLabels = labels[key];
  const entries = await getAllEntries({ lang: key });

  const contentEntries = entries.map((entry) => {
    const tags = [
      ...(entry.data.tags || []),
      ...(entry.data.roleTags || []),
      ...(entry.data.categories || [])
    ].filter(Boolean).slice(0, 10);
    const description = entry.data.description || entry.data.summary || "";
    const body = searchableBody(entry.body);

    return {
      title: entry.data.title,
      description,
      url: entry.url,
      section: sectionLabels[entry.section] || entry.section,
      tags,
      search: [entry.data.title, description, body, ...tags, entry.section].join(" ").toLowerCase()
    };
  });
  return [...contentEntries, ...getPsykeidosDevlogSearchEntries(key).map((entry) => ({
    ...entry,
    section: key === "en" ? "Development log" : "开发日志"
  }))];
}

export function searchIndexResponse(entries) {
  return new Response(JSON.stringify(entries).replace(/</g, "\\u003c"), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate"
    }
  });
}
