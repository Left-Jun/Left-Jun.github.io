import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const source = await fs.readFile(
  new URL("../src/components/ProjectRecordThread.astro", import.meta.url),
  "utf8"
);

test("record project media grows progressively on desktop without changing tablet or mobile frames", () => {
  assert.match(
    source,
    /sizes="\(max-width: 767px\) 112px, \(max-width: 1120px\) 240px, clamp\(240px, 21vw, 288px\)"/
  );
  assert.match(
    source,
    /\.record-thread__project--has-media \{[\s\S]*?grid-template-columns: clamp\(240px, 21vw, 288px\) minmax\(0, 1fr\)/
  );
  assert.match(
    source,
    /\.record-thread__media \{[\s\S]*?aspect-ratio: 16 \/ 10/
  );
  assert.match(
    source,
    /@media \(max-width: 767px\)[\s\S]*?\.record-thread__project--has-media \{[\s\S]*?grid-template-columns: 112px minmax\(0, 1fr\)/
  );
});

test("record project media keeps shared cover video behavior and fill positioning", () => {
  assert.match(source, /<CoverMedia/);
  assert.match(source, /videoSrc=\{coverVideoUrl\}/);
  assert.match(source, /style=\{`object-position: \$\{imagePosition\};`\}/);
  assert.match(
    source,
    /\.record-thread__media :global\(img\),[\s\S]*?\.record-thread__media :global\(video\) \{[\s\S]*?object-fit: cover/
  );
});
