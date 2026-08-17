import assert from "node:assert/strict";
import { test } from "node:test";

import { sortPeopleByMembershipPriority } from "../lib/person-priority";

test("kişileri en öncelikli kategori ve üyelik sırasına göre dizer", () => {
  const people = [
    {
      name: "Kategori Dışı Kişi",
      memberships: [],
    },
    {
      name: "İkinci Kategori Lideri",
      memberships: [{ order: 0, category: { order: 2 } }],
    },
    {
      name: "Rabia Naz Polatcan",
      memberships: [
        { order: 1, category: { order: 1 } },
        { order: 0, category: { order: 4 } },
      ],
    },
    {
      name: "Özden Topuz",
      memberships: [
        { order: 1, category: { order: 3 } },
        { order: 0, category: { order: 1 } },
      ],
    },
    {
      name: "Yönetim Kurulu Üyesi",
      memberships: [{ order: 2, category: { order: 1 } }],
    },
  ];

  assert.deepEqual(
    sortPeopleByMembershipPriority(people).map((person) => person.name),
    [
      "Özden Topuz",
      "Rabia Naz Polatcan",
      "Yönetim Kurulu Üyesi",
      "İkinci Kategori Lideri",
      "Kategori Dışı Kişi",
    ],
  );
});

test("eşit öncelikte isim sırasını, kategorisiz kişilerde son sırayı kullanır", () => {
  const people = [
    { name: "Zehra", memberships: [] },
    { name: "Ayşe", memberships: [] },
    {
      name: "Bora",
      memberships: [{ order: 4, category: { order: 3 } }],
    },
    {
      name: "Ahmet",
      memberships: [{ order: 4, category: { order: 3 } }],
    },
  ];

  assert.deepEqual(
    sortPeopleByMembershipPriority(people).map((person) => person.name),
    ["Ahmet", "Bora", "Ayşe", "Zehra"],
  );
});
