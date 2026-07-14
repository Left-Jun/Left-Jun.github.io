import assert from "node:assert/strict";
import test from "node:test";

import { computeProjectFilterResult } from "../src/scripts/projects-filter-client.js";

const records = [
  { id: "core-game", section: "core", type: "game" },
  { id: "core-web", section: "core", type: "web" },
  { id: "archive-game", section: "archive", type: "game" },
  { id: "archive-embedded", section: "archive", type: "embedded" }
];

test("project filters apply one type to core and archive", () => {
  const result = computeProjectFilterResult(records, "game");
  assert.equal(result.filter, "game");
  assert.equal(result.visibleCount, 2);
  assert.deepEqual(result.sectionCounts, { core: 1, archive: 1 });
  assert.deepEqual(result.visibility.filter((item) => item.visible).map((item) => item.id), [
    "core-game",
    "archive-game"
  ]);
});

test("project filters expose empty sections and recover invalid state to all", () => {
  const embedded = computeProjectFilterResult(records, "embedded");
  assert.deepEqual(embedded.sectionCounts, { core: 0, archive: 1 });

  const restored = computeProjectFilterResult(records, "invalid-filter");
  assert.equal(restored.filter, "all");
  assert.equal(restored.visibleCount, records.length);
  assert.deepEqual(restored.sectionCounts, { core: 2, archive: 2 });
});
