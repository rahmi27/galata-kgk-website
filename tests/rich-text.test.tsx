import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { RichText } from "../components/rich-text";
import { normalizeMarkdown } from "../lib/normalize-markdown";

test("normalizes CRLF, common indentation and surrounding whitespace", () => {
  assert.equal(
    normalizeMarkdown("\r\n    ## Başlık\r\n    İlk satır\r\n    İkinci satır\r\n\r\n"),
    "## Başlık\nİlk satır\nİkinci satır",
  );
});

test("renders seeded-style headings, paragraphs, lists and single-enter breaks", () => {
  const html = renderToStaticMarkup(<RichText markdown={
    "  ## Tasarım Koordinatörlüğü\r\n  İlk satır\r\n  İkinci satır\r\n\r\n  ### Görev\r\n  - **Poster** hazırla\r\n  - *Özgün* fikir üret\r\n\r\n  1. İlk\r\n  2. İkinci\r\n\r\n  > Not\r\n\r\n  ---"
  } />);
  assert.match(html, /<h2[^>]*>Tasarım Koordinatörlüğü<\/h2>/);
  assert.match(html, /İlk satır<br\/>\s*İkinci satır/);
  assert.match(html, /<h3[^>]*>Görev<\/h3>/);
  assert.match(html, /<ul[^>]*>/);
  assert.match(html, /<ol[^>]*>/);
  assert.match(html, /<strong[^>]*>Poster<\/strong>/);
  assert.match(html, /<em[^>]*>Özgün<\/em>/);
  assert.match(html, /<blockquote[^>]*>/);
  assert.match(html, /<hr[^>]*\/>/);
});

test("keeps raw HTML disabled and only makes safe HTTP(S) links clickable", () => {
  const html = renderToStaticMarkup(<RichText markdown={
    "[Güvenli](https://example.org/work) [Tehlikeli](javascript:alert(1)) <script>alert(1)</script>"
  } />);
  assert.match(html, /href="https:\/\/example.org\/work"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /<script|javascript:/);
  assert.match(html, /Tehlikeli/);
});
