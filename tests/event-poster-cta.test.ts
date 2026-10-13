import assert from "node:assert/strict";
import { test } from "node:test";

import { getPathname } from "../i18n/navigation";
import { getPosterCtaHref, getPosterCtaLabel, parsePosterCtaTarget } from "../lib/event-poster-cta";

test("afiş butonu eski bağlı etkinlik yönlendirmesini korur", () => {
  assert.deepEqual(getPosterCtaHref("linkedEvent", "galata-kulup-bulusmalari"), {
    pathname: "/etkinliklerimiz/[slug]",
    params: { slug: "galata-kulup-bulusmalari" },
  });
  assert.equal(getPosterCtaHref("linkedEvent", null), "/etkinlik");
});

test("afiş butonu admin tarafından katılım ve diğer site sayfalarına yönlendirilebilir", () => {
  assert.equal(getPosterCtaHref("join", "galata-kulup-bulusmalari"), "/katilim");
  assert.equal(getPathname({ locale: "tr", href: "/katilim" }), "/katilim");
  assert.equal(getPathname({ locale: "en", href: "/katilim" }), "/en/join");
  assert.equal(getPosterCtaHref("joinMember", null), "/katilim/uye");
  assert.equal(getPosterCtaHref("eventMode", null), "/etkinlik");
  assert.equal(getPosterCtaHref("events", null), "/etkinliklerimiz");
  assert.equal(getPosterCtaHref("contact", null), "/iletisim");
});

test("afiş butonu yazıları iki dilde düzenlenebilir ve boşsa varsayılana döner", () => {
  assert.equal(getPosterCtaLabel("tr", "Kulübe Katıl", "Join the Club"), "Kulübe Katıl");
  assert.equal(getPosterCtaLabel("en", "Kulübe Katıl", "Join the Club"), "Join the Club");
  assert.equal(getPosterCtaLabel("tr", null, null), "Etkinliğe Katıl");
  assert.equal(getPosterCtaLabel("en", null, null), "Join the Event");
});

test("yönetici formu yalnızca izinli dahili hedefleri kabul eder", () => {
  assert.equal(parsePosterCtaTarget("join"), "join");
  assert.equal(parsePosterCtaTarget("https://example.com"), null);
  assert.equal(parsePosterCtaTarget("javascript:alert(1)"), null);
  assert.equal(parsePosterCtaTarget(null), null);
});
