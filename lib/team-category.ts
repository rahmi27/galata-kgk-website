import { createNormalizedSlug } from "@/lib/slug";

export function normalizeTeamCategoryName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validateTeamCategoryName(value: string) {
  const name = normalizeTeamCategoryName(value);

  if (name.length < 2 || name.length > 80) {
    return {
      success: false as const,
      error: "Kategori adı 2–80 karakter arasında olmalıdır.",
    };
  }

  return {
    success: true as const,
    data: {
      name,
      slug: createNormalizedSlug(name),
    },
  };
}
