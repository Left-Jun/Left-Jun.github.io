import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const [cardSource, shellStyles] = await Promise.all([
  fs.readFile(new URL("../src/components/ProjectCard.astro", import.meta.url), "utf8"),
  fs.readFile(new URL("../src/styles/layers/30-shell.css", import.meta.url), "utf8")
]);

test("mobile home project covers use a stable 16:9 frame without a fixed height", () => {
  assert.match(
    shellStyles,
    /@media \(max-width: 767px\) \{[\s\S]*?\.home-dashboard \.home-project-grid \.project-card__image \{[\s\S]*?height: auto;[\s\S]*?aspect-ratio: 16 \/ 9;/
  );
});

test("home compact project covers preserve responsive image positioning and cover-video semantics", () => {
  assert.match(cardSource, /<CoverMedia/);
  assert.match(cardSource, /videoSrc=\{coverVideoUrl\}/);
  assert.match(cardSource, /sizes=\{compact \? "\(max-width: 767px\) 92vw, 24vw"/);
  assert.match(cardSource, /style=\{`object-position: \$\{imagePosition\};`\}/);
});
