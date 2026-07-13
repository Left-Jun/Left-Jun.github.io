import assert from "node:assert/strict";
import test from "node:test";

import {
  isCoverVideoCandidate,
  mutationTouchesCoverVideo,
  shouldPlayCoverVideo
} from "../src/scripts/cover-video-client.js";

const visibleState = {
  isIntersecting: true,
  isDocumentHidden: false,
  prefersReducedMotion: false,
  isElementVisible: true,
  isHeroActive: true,
  playbackFailed: false
};

test("cover video plays only while visible in the active page and hero state", () => {
  assert.equal(shouldPlayCoverVideo(visibleState), true);
  assert.equal(shouldPlayCoverVideo({ ...visibleState, isIntersecting: false }), false);
  assert.equal(shouldPlayCoverVideo({ ...visibleState, isDocumentHidden: true }), false);
  assert.equal(shouldPlayCoverVideo({ ...visibleState, isElementVisible: false }), false);
  assert.equal(shouldPlayCoverVideo({ ...visibleState, isHeroActive: false }), false);
});

test("cover video stays on its poster for reduced motion or failed autoplay", () => {
  assert.equal(shouldPlayCoverVideo({ ...visibleState, prefersReducedMotion: true }), false);
  assert.equal(shouldPlayCoverVideo({ ...visibleState, playbackFailed: true }), false);
});

test("inline article videos are never managed as cover videos", () => {
  const coverVideo = {
    matches: (selector) => selector === "video[data-cover-video]",
    closest: () => null
  };
  const articleVideo = {
    ...coverVideo,
    closest: (selector) => selector === ".article-content" ? {} : null
  };

  assert.equal(isCoverVideoCandidate(coverVideo), true);
  assert.equal(isCoverVideoCandidate(articleVideo), false);
});

test("mutation syncing ignores unrelated animation style writes", () => {
  const unrelated = { matches: () => false, querySelector: () => null };
  const coverContainer = { matches: () => false, querySelector: () => ({}) };

  assert.equal(mutationTouchesCoverVideo({ type: "attributes", target: unrelated }), false);
  assert.equal(mutationTouchesCoverVideo({ type: "attributes", target: coverContainer }), true);
  assert.equal(mutationTouchesCoverVideo({ type: "childList", addedNodes: [coverContainer], removedNodes: [] }), true);
});
