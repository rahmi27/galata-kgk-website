export function normalizePersonName(name: string) {
  return name
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i");
}
