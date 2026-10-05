import assert from "node:assert/strict";
import { test } from "node:test";

import { shouldShowEventEntryButton } from "../lib/event-detail-entry";

test("etkinliğe giriş butonu yalnızca açık ve bağlı oturumun detayında görünür", () => {
  assert.equal(shouldShowEventEntryButton({ linkedEventId: 12, detailEntryButtonEnabled: true }, 12), true);
  assert.equal(shouldShowEventEntryButton({ linkedEventId: 12, detailEntryButtonEnabled: false }, 12), false);
  assert.equal(shouldShowEventEntryButton({ linkedEventId: 12, detailEntryButtonEnabled: true }, 13), false);
  assert.equal(shouldShowEventEntryButton({ linkedEventId: null, detailEntryButtonEnabled: true }, 12), false);
  assert.equal(shouldShowEventEntryButton(null, 12), false);
});
