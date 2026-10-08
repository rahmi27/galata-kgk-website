import { getSafeHttpUrl } from "@/lib/url-security";

export type LinkedTextPart = { text: string; href?: string };

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)}\]]+$/;

export function linkifyHttpText(value: string): LinkedTextPart[] {
  const parts: LinkedTextPart[] = [];
  let cursor = 0;

  for (const match of value.matchAll(URL_PATTERN)) {
    const start = match.index;
    if (start > cursor) parts.push({ text: value.slice(cursor, start) });

    const candidate = match[0];
    const trailing = candidate.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const text = candidate.slice(0, candidate.length - trailing.length);
    const href = getSafeHttpUrl(text);
    parts.push(href ? { text, href } : { text: candidate });
    if (href && trailing) parts.push({ text: trailing });
    cursor = start + candidate.length;
  }

  if (cursor < value.length) parts.push({ text: value.slice(cursor) });
  return parts;
}
