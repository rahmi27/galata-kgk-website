import assert from "node:assert/strict";
import test from "node:test";

import { getEventBackPath } from "../components/event-mode/event-back-button";

test("panel geri bağlantısı otomatik giriş yönlendirmesine dönmez", () => {
  assert.equal(getEventBackPath("/etkinlik/panel", "galata-guzfest"), "/etkinliklerimiz/galata-guzfest");
  assert.equal(getEventBackPath("/etkinlik/panel", null), "/etkinliklerimiz");
  assert.equal(getEventBackPath("/en/event/hub", "galata-guzfest"), "/en/events/galata-guzfest");
  assert.equal(getEventBackPath("/en/event/hub", null), "/en/events");
});

test("alt ekranlar panele, skor tablosu quiz ekranına döner", () => {
  assert.equal(getEventBackPath("/etkinlik/panel/quiz", "galata-guzfest"), "/etkinlik/panel");
  assert.equal(getEventBackPath("/en/event/hub/raffle", null), "/en/event/hub");
  assert.equal(getEventBackPath("/etkinlik/panel/quiz/tablo", null), "/etkinlik/panel/quiz");
  assert.equal(getEventBackPath("/en/event/hub/quiz/leaderboard", null), "/en/event/hub/quiz");
});
