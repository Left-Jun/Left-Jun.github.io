import assert from "node:assert/strict";
import test from "node:test";

import {
  computeRecordVisibility,
  recordVisibility
} from "../src/scripts/records-filter-client.js";

const records = [
  { id: "complete", hasRetrospective: true, hasPlan: true },
  { id: "retro-only", hasRetrospective: true, hasPlan: false },
  { id: "plan-only", hasRetrospective: false, hasPlan: true }
];

test("record filter exposes the requested sibling phases", () => {
  assert.deepEqual(recordVisibility(records[0], "all"), {
    threadVisible: true,
    retrospectives: true,
    plans: true
  });
  assert.deepEqual(recordVisibility(records[0], "plans"), {
    threadVisible: true,
    retrospectives: false,
    plans: true
  });
  assert.equal(recordVisibility(records[1], "plans").threadVisible, false);
});

test("complete view keeps only paired project threads and invalid views restore all", () => {
  const complete = computeRecordVisibility(records, "complete");
  assert.equal(complete.visibleCount, 1);
  assert.deepEqual(complete.visibility.filter((item) => item.threadVisible).map((item) => item.id), ["complete"]);
  assert.equal(computeRecordVisibility(records, "invalid").visibleCount, 3);
});
