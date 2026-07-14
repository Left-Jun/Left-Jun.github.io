import assert from "node:assert/strict";
import test from "node:test";

import {
  computePostFilterResult,
  matchesPostFilter,
  normalizePostFilterState
} from "../src/scripts/posts-filter-client.js";

const records = [
  { id: "technical-2026", columns: ["technical"], year: "2026" },
  { id: "standalone-2026", columns: ["standalone"], year: "2026" },
  { id: "technical-2025", columns: ["technical"], year: "2025" }
];

test("post filters intersect column and year", () => {
  assert.equal(matchesPostFilter(records[0], { column: "technical", year: "2026" }), true);
  assert.equal(matchesPostFilter(records[1], { column: "technical", year: "2026" }), false);
  assert.equal(matchesPostFilter(records[2], { column: "technical", year: "2026" }), false);

  const result = computePostFilterResult(records, { column: "technical", year: "2026" });
  assert.equal(result.visibleCount, 1);
  assert.deepEqual(result.visibility.filter((item) => item.visible).map((item) => item.id), ["technical-2026"]);
});

test("post filters restore all records and reject unsupported state", () => {
  assert.equal(computePostFilterResult(records, { column: "all", year: "all" }).visibleCount, 3);
  assert.deepEqual(normalizePostFilterState(
    { column: "unknown", year: "1999" },
    { columns: ["technical", "standalone"], years: ["2026", "2025"] }
  ), { column: "all", year: "all" });
});
