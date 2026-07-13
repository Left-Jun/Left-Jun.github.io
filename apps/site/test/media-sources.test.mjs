import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  collectContentCoverVideoSources,
  collectContentImageSources,
  validateCoverVideoSources
} from "../../../scripts/media-sources.mjs";

async function writeEntry(contentRoot, relativePath, frontMatter) {
  const target = path.join(contentRoot, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const fields = Object.entries(frontMatter)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  await fs.writeFile(target, `---\n${fields}\n---\n`, "utf8");
}

test("cover videos resolve beside their content assets without entering the image manifest", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-media-sources-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const contentRoot = path.join(root, "content");
  const publicRoot = path.join(root, "public");

  await writeEntry(contentRoot, "projects/example/index.md", {
    title: "Example",
    image: "cover.png",
    coverVideo: "cover.mp4"
  });

  const images = await collectContentImageSources({ contentRoot, publicRoot });
  const videos = await collectContentCoverVideoSources({ contentRoot, publicRoot });

  assert.deepEqual(images, [path.join(publicRoot, "content-assets", "projects", "example", "cover.png")]);
  assert.equal(images.some((source) => source.endsWith("cover.mp4")), false);
  assert.deepEqual(videos, [{
    entryPath: "projects/example/index.md",
    value: "cover.mp4",
    extension: ".mp4",
    sourcePath: path.join(publicRoot, "content-assets", "projects", "example", "cover.mp4"),
    supported: true,
    withinPublicRoot: true
  }]);
});

test("cover video collection supports site paths and webm while exposing invalid local references", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "leftjun-cover-videos-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const contentRoot = path.join(root, "content");
  const publicRoot = path.join(root, "public");

  await writeEntry(contentRoot, "posts/site-video/index.md", {
    title: "Site video",
    coverVideo: "/media/cover.webm?version=1"
  });
  await writeEntry(contentRoot, "posts/invalid/index.md", {
    title: "Invalid video",
    coverVideo: "cover.avi"
  });
  await writeEntry(contentRoot, "posts/escaped/index.md", {
    title: "Escaped video",
    coverVideo: "../../../../outside.mp4"
  });
  await writeEntry(contentRoot, "posts/missing/index.md", {
    title: "Missing video",
    coverVideo: "missing.mp4"
  });
  await writeEntry(contentRoot, "posts/external/index.md", {
    title: "External video",
    coverVideo: "https://example.com/cover.mp4"
  });
  await writeEntry(contentRoot, "posts/invalid-reference/index.md", {
    title: "Invalid reference",
    coverVideo: "data:video/mp4;base64,AAAA"
  });
  await fs.mkdir(path.join(publicRoot, "media"), { recursive: true });
  await fs.writeFile(path.join(publicRoot, "media", "cover.webm"), "test", "utf8");

  const videos = await collectContentCoverVideoSources({ contentRoot, publicRoot });
  assert.equal(videos.length, 5);

  const siteVideo = videos.find((video) => video.entryPath.includes("site-video"));
  assert.equal(siteVideo.extension, ".webm");
  assert.equal(siteVideo.supported, true);
  assert.equal(siteVideo.withinPublicRoot, true);
  assert.equal(siteVideo.sourcePath, path.join(publicRoot, "media", "cover.webm"));

  const invalidVideo = videos.find((video) => video.entryPath.includes("invalid"));
  assert.equal(invalidVideo.supported, false);
  assert.equal(invalidVideo.withinPublicRoot, true);

  const escapedVideo = videos.find((video) => video.entryPath.includes("escaped"));
  assert.equal(escapedVideo.supported, true);
  assert.equal(escapedVideo.withinPublicRoot, false);

  const invalidReference = videos.find((video) => video.entryPath.includes("invalid-reference"));
  assert.equal(invalidReference.invalidReference, true);

  const errors = await validateCoverVideoSources(videos);
  assert.equal(errors.length, 4);
  assert.match(errors.join("\n"), /Invalid cover video reference.*invalid-reference.*data:video\/mp4/i);
  assert.match(errors.join("\n"), /outside public root: posts\/escaped\/index\.md.*outside\.mp4/);
  assert.match(errors.join("\n"), /expected \.mp4 or \.webm: posts\/invalid\/index\.md.*cover\.avi/);
  assert.match(errors.join("\n"), /Missing cover video: posts\/missing\/index\.md.*missing\.mp4/);
  assert.doesNotMatch(errors.join("\n"), /site-video/);
});
