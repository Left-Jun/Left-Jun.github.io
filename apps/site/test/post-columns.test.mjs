import assert from "node:assert/strict";
import test from "node:test";
import { POST_COLUMN_IDS } from "@left-jun/content-model";

import {
  POST_FILTER_MIN_ITEMS,
  buildPostFilterOptions,
  getPostColumns,
  postMatchesColumn,
  selectPostSpotlight,
  shouldShowPostFilters,
  splitPostsForIndex
} from "../src/lib/post-columns.js";

function post(slug, date, data = {}) {
  return {
    slug,
    ref: `posts/${slug}`,
    lang: "zh-cn",
    data: {
      title: slug,
      date: new Date(date),
      categories: [],
      tags: [],
      columnIds: [],
      ...data
    }
  };
}

test("post columns use explicit IDs instead of taxonomy terms", () => {
  const explicit = post("explicit", "2026-07-01T10:00:00+08:00", {
    columnIds: ["technical"]
  });
  const tagged = post("tagged", "2026-06-01T10:00:00+08:00", {
    tags: ["Astro", "建站"]
  });
  const column = { id: "technical" };

  assert.equal(postMatchesColumn(explicit, column), true);
  assert.equal(postMatchesColumn(tagged, column), false);
  assert.deepEqual(getPostColumns([explicit, tagged], "zh-cn").map((item) => item.id), POST_COLUMN_IDS);
  assert.deepEqual(getPostColumns([explicit, tagged], "zh-cn")[0].entries.map((entry) => entry.slug), ["explicit"]);
});

test("post spotlight prefers authored weight and falls back to real media", () => {
  const entries = [
    post("latest-text", "2026-07-14T10:00:00+08:00"),
    post("featured-later", "2026-07-12T10:00:00+08:00", { featured: true, featuredWeight: 8 }),
    post("featured-first", "2026-07-10T10:00:00+08:00", { featured: true, featuredWeight: 2, image: "cover.png" })
  ];
  assert.equal(selectPostSpotlight(entries).slug, "featured-first");

  const fallback = [
    post("latest-text", "2026-07-14T10:00:00+08:00"),
    post("older-media", "2026-07-10T10:00:00+08:00", { image: "older.png" }),
    post("media", "2026-07-12T10:00:00+08:00", { image: "cover.png" })
  ];
  assert.equal(selectPostSpotlight(fallback).slug, "media");
  const split = splitPostsForIndex(fallback, "zh-cn");
  assert.deepEqual(split.archive.map((entry) => entry.slug), ["latest-text", "older-media"]);
  assert.equal(selectPostSpotlight([
    post("featured-text", "2026-07-14T10:00:00+08:00", { featured: true, featuredWeight: 1 }),
    post("plain-text", "2026-07-12T10:00:00+08:00")
  ]), null);
});

test("post filters stay hidden for small archives and expose real column/year counts", () => {
  const entries = [
    post("a", "2026-07-01T10:00:00+08:00", { columnIds: ["technical"] }),
    post("b", "2026-06-01T10:00:00+08:00", { columnIds: ["technical"] }),
    post("c", "2026-05-01T10:00:00+08:00"),
    post("d", "2025-05-01T10:00:00+08:00"),
    post("e", "2025-04-01T10:00:00+08:00"),
    post("f", "2025-03-01T10:00:00+08:00")
  ];
  const options = buildPostFilterOptions(entries, "zh-cn");

  assert.equal(POST_FILTER_MIN_ITEMS, 6);
  assert.deepEqual(options.columns.map(({ value, count }) => ({ value, count })), [
    { value: "technical", count: 2 },
    { value: "standalone", count: 4 }
  ]);
  assert.deepEqual(options.years.map(({ value, count }) => ({ value, count })), [
    { value: "2026", count: 3 },
    { value: "2025", count: 3 }
  ]);
  assert.equal(shouldShowPostFilters(entries, options), true);
  assert.equal(shouldShowPostFilters(entries.slice(0, 5), buildPostFilterOptions(entries.slice(0, 5))), false);
});
