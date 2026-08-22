import assert from "node:assert/strict";
import {test} from "node:test";

import {
  localizedOptionalValue,
  localizedValue,
} from "../lib/localized-content";

test("İngilizce dinamik içerik varsa onu, yoksa Türkçe değeri kullanır", () => {
  assert.equal(localizedValue("en", "Türkçe başlık", "English title"), "English title");
  assert.equal(localizedValue("en", "Türkçe başlık", "   "), "Türkçe başlık");
  assert.equal(localizedValue("tr", "Türkçe başlık", "English title"), "Türkçe başlık");
});

test("opsiyonel alanlarda İngilizce fallback ve boş değer davranışı tutarlıdır", () => {
  assert.equal(localizedOptionalValue("en", "Türkçe açıklama", null), "Türkçe açıklama");
  assert.equal(localizedOptionalValue("en", null, "English description"), "English description");
  assert.equal(localizedOptionalValue("tr", null, "English description"), null);
});
