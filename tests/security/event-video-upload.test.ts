import assert from "node:assert/strict";
import { test } from "node:test";

import { isValidVideoSignature, MAX_SERVER_VIDEO_SIZE } from "../../lib/event-video-validation";

test("sunucu üzerinden video sınırı Vercel istek sınırının altında kalır", () => {
  assert.equal(MAX_SERVER_VIDEO_SIZE, 4 * 1024 * 1024);
  assert.ok(MAX_SERVER_VIDEO_SIZE < 4.5 * 1024 * 1024);
});

test("MP4 ve WebM gerçek dosya imzasıyla doğrulanır", () => {
  const mp4 = new Uint8Array(12);
  mp4.set(new TextEncoder().encode("ftyp"), 4);
  assert.equal(isValidVideoSignature(mp4, "video/mp4"), true);
  assert.equal(isValidVideoSignature(new TextEncoder().encode("not an mp4"), "video/mp4"), false);

  const webm = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0x00]);
  assert.equal(isValidVideoSignature(webm, "video/webm"), true);
  assert.equal(isValidVideoSignature(webm, "video/mp4"), false);
  assert.equal(isValidVideoSignature(webm, "application/octet-stream"), false);
});
