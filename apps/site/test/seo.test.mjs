import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAlternateLinks,
  buildStructuredData,
  resolveOptionalHttpUrl,
  resolveSiteUrl,
  serializeJsonLd
} from "../src/lib/seo.ts";

const siteUrl = "https://leftjun.com/";

test("resolves only HTTP URLs and keeps the site URL as the required fallback", () => {
  assert.equal(resolveOptionalHttpUrl("/projects/", siteUrl), "https://leftjun.com/projects/");
  assert.equal(resolveOptionalHttpUrl("javascript:alert(1)", siteUrl), undefined);
  assert.equal(resolveOptionalHttpUrl("not a valid URL", "not a valid base"), undefined);
  assert.equal(resolveSiteUrl("javascript:alert(1)", siteUrl), siteUrl);
});

test("omits hreflang links unless a distinct valid alternate exists", () => {
  const common = {
    siteUrl,
    canonicalUrl: "https://leftjun.com/projects/example/",
    lang: "zh-cn"
  };

  assert.deepEqual(buildAlternateLinks(common), []);
  assert.deepEqual(buildAlternateLinks({ ...common, alternateUrl: "javascript:alert(1)" }), []);
  assert.deepEqual(buildAlternateLinks({ ...common, alternatePath: "/projects/example/" }), []);
  assert.deepEqual(buildAlternateLinks({ ...common, alternatePath: "/en/projects/example/", alternateLang: "zh-cn" }), []);
});

test("emits reciprocal language links with Chinese as x-default", () => {
  assert.deepEqual(buildAlternateLinks({
    siteUrl,
    canonicalUrl: "/projects/example/",
    lang: "zh-cn",
    alternatePath: "/en/projects/example/"
  }), [
    { hreflang: "zh-CN", href: "https://leftjun.com/projects/example/" },
    { hreflang: "en", href: "https://leftjun.com/en/projects/example/" },
    { hreflang: "x-default", href: "https://leftjun.com/projects/example/" }
  ]);

  assert.deepEqual(buildAlternateLinks({
    siteUrl,
    canonicalUrl: "/en/projects/example/",
    lang: "en",
    alternatePath: "/projects/example/"
  })[2], {
    hreflang: "x-default",
    href: "https://leftjun.com/projects/example/"
  });
});

test("builds normalized structured data without inventing unsafe social URLs", () => {
  const data = buildStructuredData({
    siteName: "Left Jun",
    siteUrl,
    canonicalUrl: "/projects/example/",
    pageTitle: "Example",
    pageDescription: "A playable prototype",
    pageImageUrl: "/content-assets/example.webp",
    personImageUrl: "/img/avatar.jpg",
    lang: "en",
    sameAs: ["https://github.com/Left-Jun", "javascript:alert(1)", "https://github.com/Left-Jun"],
    creativeWork: {
      type: "VideoGame",
      datePublished: "2026-06-01",
      dateModified: "invalid",
      keywords: ["Unity", "Unity", "Gameplay"]
    },
    breadcrumbs: [
      { name: "Projects", url: "/projects/" },
      { name: "Example" }
    ]
  });

  const graph = data["@graph"];
  assert.ok(Array.isArray(graph));
  assert.deepEqual(graph[0].sameAs, ["https://github.com/Left-Jun"]);
  assert.equal(graph[0].image, "https://leftjun.com/img/avatar.jpg");
  assert.equal(graph[2]["@type"], "VideoGame");
  assert.equal(graph[2].url, "https://leftjun.com/projects/example/");
  assert.equal(graph[2].datePublished, "2026-06-01T00:00:00.000Z");
  assert.equal(graph[2].dateModified, undefined);
  assert.deepEqual(graph[2].keywords, ["Unity", "Gameplay"]);
  assert.equal(graph[3]["@id"], "https://leftjun.com/projects/example/#breadcrumb-list");
});

test("serializes JSON-LD without allowing a script-closing sequence", () => {
  const value = { text: "</script><script>alert(1)</script>\u2028next\u2029line" };
  const serialized = serializeJsonLd(value);

  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("\u2028"), false);
  assert.equal(serialized.includes("\u2029"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});
