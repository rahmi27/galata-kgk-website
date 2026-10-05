import assert from "node:assert/strict";
import { test } from "node:test";

import { filterAndSortEvents } from "../lib/event-list-order";

const events = [
  { title: "Tarihsiz Z", date: null },
  { title: "Geçmiş eski", date: "2026-09-01T10:00:00.000Z" },
  { title: "Yaklaşan geç", date: "2026-10-20T10:00:00.000Z" },
  { title: "Tarihsiz A", date: null },
  { title: "Geçmiş yakın", date: "2026-10-01T10:00:00.000Z" },
  { title: "Yaklaşan yakın", date: "2026-10-08T10:00:00.000Z" },
];
const now = "2026-10-06T10:00:00.000Z";

test("yaklaşan etkinlikler önce tarihe göre, tarihsizler sonda sıralanır", () => {
  assert.deepEqual(
    filterAndSortEvents(events, "upcoming", now, "tr").map(({ title }) => title),
    ["Yaklaşan yakın", "Yaklaşan geç", "Tarihsiz A", "Tarihsiz Z"],
  );
});

test("geçmiş filtresi tarihsizleri dışarıda bırakır ve en yakını öne alır", () => {
  assert.deepEqual(
    filterAndSortEvents(events, "past", now, "tr").map(({ title }) => title),
    ["Geçmiş yakın", "Geçmiş eski"],
  );
});

test("tümü filtresi yaklaşanları, ardından geçmişi, son olarak tarihsizleri gösterir", () => {
  assert.deepEqual(
    filterAndSortEvents(events, "all", now, "tr").map(({ title }) => title),
    ["Yaklaşan yakın", "Yaklaşan geç", "Geçmiş yakın", "Geçmiş eski", "Tarihsiz A", "Tarihsiz Z"],
  );
});
