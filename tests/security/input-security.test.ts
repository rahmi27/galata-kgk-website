import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { isHoneypotTriggered } from "../../lib/form-spam-protection";
import {
  validateContactSubmission,
  validateMembershipApplication,
} from "../../lib/form-validation";
import { shouldBlockAdminLogin } from "../../lib/rate-limit-policy";
import {
  buildGoogleMapsUrls,
  getSafeHttpUrl,
  isAllowedGoogleMapsUrl,
} from "../../lib/url-security";

test("React, yönetici kaynaklı metinlerde HTML/XSS yükünü escape eder", () => {
  const payload = `<img src=x onerror=alert(1)><script>alert("xss")</script>`;
  const markup = renderToStaticMarkup(createElement("p", null, payload));

  assert.equal(markup.includes("<script>"), false);
  assert.equal(markup.includes("onerror="), true);
  assert.match(markup, /&lt;script&gt;/);
});

test("iletişim validasyonu tip ve uzunluk sınırlarını sunucuda uygular", () => {
  const invalid = validateContactSubmission({
    name: "A",
    email: "gecersiz",
    message: "kısa",
    privacyAcknowledged: true,
  });
  assert.equal(invalid.success, false);

  const sqlLikeMessage = `'; DROP TABLE "ContactSubmission"; -- güvenlik testi`;
  const valid = validateContactSubmission({
    name: "Test Kullanıcısı",
    email: "security@example.com",
    message: sqlLikeMessage,
    privacyAcknowledged: true,
  });

  assert.equal(valid.success, true);
  if (valid.success) {
    assert.equal(valid.data.message, sqlLikeMessage);
  }
});

test("katılım validasyonu hatalı tipleri ve aşırı uzun girdileri reddeder", () => {
  const result = validateMembershipApplication({
    fullName: "Test Kullanıcısı",
    email: "security@example.com",
    department: "A".repeat(151),
    motivation: "Yeterince uzun bir motivasyon metni.",
    privacyAcknowledged: true,
  });

  assert.equal(result.success, false);
});

test("honeypot yalnızca gizli alan doldurulduğunda tetiklenir", () => {
  assert.equal(isHoneypotTriggered({ website: "" }), false);
  assert.equal(isHoneypotTriggered({ website: "https://spam.example" }), true);
  assert.equal(isHoneypotTriggered(null), false);
});

test("dış bağlantı filtresi çalıştırılabilir ve kimlik bilgili URL'leri reddeder", () => {
  assert.equal(getSafeHttpUrl("javascript:alert(1)"), null);
  assert.equal(getSafeHttpUrl("data:text/html,<script>alert(1)</script>"), null);
  assert.equal(getSafeHttpUrl("https://user:pass@example.com/path"), null);
  assert.equal(getSafeHttpUrl("https://example.com/path"), "https://example.com/path");
});

test("Google Haritalar URL'si sabit izinli host üzerinde üretilir", () => {
  const maliciousAddress = `Galata <script>alert(1)</script> & javascript:alert(1)`;
  const { directionsUrl, embedUrl } = buildGoogleMapsUrls(maliciousAddress);
  const embed = new URL(embedUrl);

  assert.equal(isAllowedGoogleMapsUrl(embedUrl), true);
  assert.equal(embed.hostname, "www.google.com");
  assert.equal(embed.searchParams.get("q"), maliciousAddress);
  assert.equal(new URL(directionsUrl).hostname, "www.google.com");
});

test("admin girişi beş kullanıcı denemesinde ve yirmi IP denemesinde kilitlenir", () => {
  assert.equal(shouldBlockAdminLogin(4, 19), false);
  assert.equal(shouldBlockAdminLogin(5, 0), true);
  assert.equal(shouldBlockAdminLogin(0, 20), true);
});
