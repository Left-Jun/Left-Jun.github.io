import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const source = await fs.readFile(
  new URL("../src/components/ProjectRecordThread.astro", import.meta.url),
  "utf8"
);

test("record project media grows across mobile and wide desktop without changing the tablet frame", () => {
  assert.match(
    source,
    /sizes="\(max-width: 767px\) clamp\(140px, 44vw, 176px\), \(max-width: 1120px\) 240px, clamp\(256px, 23vw, 320px\)"/
  );
  assert.match(
    source,
    /\.record-thread__project--has-media \{[\s\S]*?grid-template-columns: 240px minmax\(0, 1fr\)/
  );
  assert.match(
    source,
    /@media \(min-width: 1121px\) \{[\s\S]*?\.record-thread__project--has-media \{[\s\S]*?grid-template-columns: clamp\(256px, 23vw, 320px\) minmax\(0, 1fr\)/
  );
  assert.match(
    source,
    /\.record-thread__media \{[\s\S]*?aspect-ratio: 16 \/ 10/
  );
  assert.match(
    source,
    /@media \(max-width: 767px\)[\s\S]*?\.record-thread__project--has-media \{[\s\S]*?grid-template-columns: clamp\(140px, 44vw, 176px\) minmax\(0, 1fr\)/
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
