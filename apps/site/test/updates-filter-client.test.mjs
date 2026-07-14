import assert from "node:assert/strict";
import test from "node:test";

import {
  computeTimelineFilterResult,
  matchesTimelineFilter,
  normalizeTimelineFilterState
} from "../src/scripts/updates-filter-client.js";

const records = [
  { id: "project-2026", filterGroup: "project-progress", year: "2026" },
  { id: "event-2026", filterGroup: "events-awards", year: "2026" },
  { id: "writing-2025", filterGroup: "publishing-writing", year: "2025" }
];

test("timeline filters intersect semantic group and year", () => {
  assert.equal(matchesTimelineFilter(records[0], { group: "project-progress", year: "2026" }), true);
  assert.equal(matchesTimelineFilter(records[0], { group: "project-progress", year: "2025" }), false);
  assert.equal(matchesTimelineFilter(records[1], { group: "project-progress", year: "2026" }), false);

  const result = computeTimelineFilterResult(records, { group: "publishing-writing", year: "2025" });
  assert.equal(result.visibleCount, 1);
  assert.deepEqual(result.visibility.filter((item) => item.visible).map((item) => item.id), ["writing-2025"]);
});

test("all filters restore the complete archive and unsupported values reset safely", () => {
  assert.equal(computeTimelineFilterResult(records, { group: "all", year: "all" }).visibleCount, 3);
  assert.deepEqual(normalizeTimelineFilterState(
    { group: "unknown", year: "1999" },
    { groups: ["project-progress", "events-awards"], years: ["2026", "2025"] }
  ), { group: "all", year: "all" });
});
