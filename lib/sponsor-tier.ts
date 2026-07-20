import { createNormalizedSlug } from "@/lib/slug";

export function normalizeSponsorTierName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function validateSponsorTierName(value: string) {
  const name = normalizeSponsorTierName(value);

  if (name.length < 2 || name.length > 80) {
    return {
      success: false as const,
      error: "Tier adı 2–80 karakter arasında olmalıdır.",
    };
  }

  return {
    success: true as const,
    data: {
      name,
      slug: createNormalizedSlug(name, "sponsor-tier"),
    },
  };
}
