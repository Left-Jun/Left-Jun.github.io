import rss from "@astrojs/rss";
import { config, getTimelineEntries } from "./content.js";

function validDate(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function feedEntries(lang) {
  return getTimelineEntries(lang);
}

export async function createFeed(context, lang) {
  const isEnglish = lang === "en";
  const site = context.site || new URL(config.siteUrl);
  const feedPath = isEnglish ? "/en/feed.xml" : "/feed.xml";
  const selfUrl = new URL(feedPath, site).toString();
  const entries = await feedEntries(isEnglish ? "en" : "zh-cn");

  return rss({
    title: isEnglish ? "Left Jun - Updates" : "Left Jun - \u6700\u65b0\u66f4\u65b0",
    description: isEnglish
      ? "Projects, development updates, articles, and retrospectives from Left Jun."
      : "Left Jun \u7684\u9879\u76ee\u8fdb\u5c55\u3001\u5f00\u53d1\u8bb0\u5f55\u3001\u6587\u7ae0\u4e0e\u590d\u76d8\u3002",
    site,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description || undefined,
      pubDate: validDate(entry.data.date),
      link: entry.url,
      categories: [...new Set([...(entry.data.categories || []), ...(entry.data.tags || [])])]
    })),
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: `<language>${isEnglish ? "en" : "zh-CN"}</language><atom:link href="${xmlEscape(selfUrl)}" rel="self" type="application/rss+xml" />`
  });
}
