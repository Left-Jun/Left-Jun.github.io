import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const [articleLayout, detailStyles, updatesTimeline, recordsPage] = await Promise.all([
  fs.readFile(new URL("../src/components/ArticleLayout.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/styles/content-pages-refresh.css", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/UpdateTimeline.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/components/RecordsPage.astro", import.meta.url), "utf8")
]);

test("reading and record details place titles before naturally-sized static cover images", () => {
  assert.match(articleLayout, /isPost && "post-detail-hero"/);
  assert.match(articleLayout, /isRecord && "record-detail-hero"/);
  assert.match(detailStyles, /\.post-detail-page \.post-detail-hero__details \{[\s\S]*?order: 1/);
  assert.match(detailStyles, /\.record-detail-page \.record-detail-hero__details \{[\s\S]*?order: 1/);
  assert.match(detailStyles, /\.post-detail-page \.post-detail-hero \.article-image img \{[\s\S]*?height: auto;[\s\S]*?object-fit: contain/);
  assert.match(detailStyles, /\.record-detail-page \.record-detail-hero \.article-image img \{[\s\S]*?height: auto;[\s\S]*?object-fit: contain/);
});

test("detail cover videos retain a stable loop-cover frame", () => {
  assert.match(articleLayout, /content-detail-hero--video/);
  assert.match(detailStyles, /\.post-detail-page \.content-detail-hero--video \.article-image \{[\s\S]*?aspect-ratio: 16 \/ 10/);
  assert.match(detailStyles, /\.record-detail-page \.content-detail-hero--video \.article-image \{[\s\S]*?aspect-ratio: 16 \/ 10/);
});

test("mobile section chrome leaves room for the first real content", () => {
  assert.match(updatesTimeline, /\.updates-spotlight \.updates-block__heading \{[\s\S]*?position: absolute;[\s\S]*?clip: rect\(0, 0, 0, 0\)/);
  assert.match(recordsPage, /@media \(max-width: 767px\)[\s\S]*?\.records-page-header \{[\s\S]*?margin-bottom: 12px/);
  assert.match(recordsPage, /@media \(max-width: 767px\)[\s\S]*?\.records-page-header__description \{[\s\S]*?display: none/);
});
