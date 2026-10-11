import { test } from "node:test";
import assert from "node:assert/strict";
import { isPositionOpen, openPositionWhere } from "../lib/recruitment-availability";

const now = new Date("2026-10-11T12:00:00.000Z");

test("only open, unarchived positions before their deadline are public", () => {
  assert.equal(isPositionOpen({ isOpen: true, isArchived: false, deadline: null }, now), true);
  assert.equal(isPositionOpen({ isOpen: true, isArchived: false, deadline: "2026-10-11T12:00:01.000Z" }, now), true);
  assert.equal(isPositionOpen({ isOpen: false, isArchived: false, deadline: null }, now), false);
  assert.equal(isPositionOpen({ isOpen: true, isArchived: true, deadline: null }, now), false);
  assert.equal(isPositionOpen({ isOpen: true, isArchived: false, deadline: now }, now), false);
  assert.equal(isPositionOpen({ isOpen: true, isArchived: false, deadline: "2026-10-11T11:59:59.000Z" }, now), false);
  assert.deepEqual(openPositionWhere(now), {
    isOpen: true,
    isArchived: false,
    OR: [{ deadline: null }, { deadline: { gt: now } }],
  });
});
