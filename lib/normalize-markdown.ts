export function normalizeMarkdown(value: string) {
  const lines = value.replace(/\r\n?/g, "\n").split("\n");
  const contentLines = lines.filter((line) => line.trim().length > 0);
  if (!contentLines.length) return "";

  const commonIndent = Math.min(
    ...contentLines.map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0),
  );

  return lines.map((line) => line.slice(commonIndent)).join("\n").trim();
}
